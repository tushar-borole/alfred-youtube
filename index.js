'use strict';

require('dotenv').config({path: __dirname + '/variables.env'});
const alfy = require('alfy');
const youtubeSearch = require('youtube-search');

class Alfred {
  constructor() {
    this.key = process.env.YOUTUBE_API_KEY;
    this.output = [];
  }

  setOutput(item) {
    this.output.push({
      uid: item.id,
      title: item.title,
      subtitle: `${item.channelTitle} || ${item.kind
        .split('#')[1]
        .toUpperCase()}`,
      arg: item.link
    });
  }

  getOutput() {
    if (this.output.length === 0) {
      this.output.push({
        title: 'No items found.'
      });
    }

    return this.output;
  }

  hasApiKey() {
    if (this.key.length === 0) {
      this.output.push({
        title: 'No API key. Press ENTER and follow the instructions',
        arg: 'https://github.com/patrickkahl/alfred-youtube#install'
      });
      return false;
    }

    return true;
  }

  run() {
    if (this.hasApiKey()) {
      const promise = new Promise((resolve, reject) => {
        youtubeSearch(
          alfy.input,
          {
            order: 'relevance',
            key: this.key
          },
          (err, results) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(results);
          }
        );
      });

      promise.then(
        results => {
          results.forEach(result => {
            this.setOutput(result);
          });
          alfy.output(this.getOutput());
        },
        function(err) {
          alfy.error(err);
        }
      );
    } else {
      alfy.output(this.getOutput());
    }
  }
}

const wf = new Alfred();
wf.run();
