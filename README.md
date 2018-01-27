# Arrow
[![Build Status](https://travis-ci.org/FozzieHi/Arrow.svg?branch=master)](https://travis-ci.org/FozzieHi/Arrow) [![GitHub last commit](https://img.shields.io/github/last-commit/fozziehi/arrow.svg?label=Last+updated)]()

The Arrow Discord Bot source code.

How do I make money?
```
You can make money by talking in chat with atleast 7 characters, every 30 seconds and you make $50.

You can also do ?daily to get $2,000 every 24 hours.
```

Moderation Logs
```
Nearly every log imaginable is logged with Arrow, from join messages to specific ban lengths, Arrow has it all.
```

Self Hosting
```
1) Download the zip file and extract it.
2) Open the Arrow master folder and run `npm install`.
3) Go to src and create a file named 'credentials.json'.
4) Copy the template into credentials.json from below and edit it (Free database hosting available at mlab.com) [Not sponsored].
5) Create an empty folder called 'intervals' in src.
6) Go back to src and open up Command Prompt in that area. Then type in `node index.js`.
7) Have fun!
```

credentials.json template.
```json
{
  "token": "bottoken",
  "ownerIds": ["yourid"],
  "mongodbConnectionURL": "mongodb://user:pass@domain:port/dbname"
}
```
