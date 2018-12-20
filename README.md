# lightping

It's a thing that rates your latency between you and a server. Pretty much the ping command, but it does additional math and rates your connection.

Theorically, 100 is the time it takes light to do a roundtrip in a standard optical fibre, higher is faster (because you have better fibre), lower is slower, so it's proportional to distance divided by time.

For distance, it checks the GeoIP database for your IP and the host's and calculates the distance. Of course it's very approximate, if not plain wrong because it's a big company that uses anycast with their servers.

It's not meant to be very accurate and it's more for educational purposes, so have fun with that :)

## Usage

```
node index.js <hostname>
```