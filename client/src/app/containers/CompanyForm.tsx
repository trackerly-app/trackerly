import React, { useEffect, useRef, FormEvent } from 'react';

const fetch = require('node-fetch');

export type CompanyProps = {
  user_id: number;
  id?: number;
};

export async function getIcon(url: string): Promise<string> {
  // I think if we are going to store this in a database, we should probably store a binary string
  // representing the .png/.jpg/.ico image found. Not sure what's best
  let icon: string = 'I';

  try {
    // get the favicon from the url
    let res = await fetch(url);
    if (res.ok) {
      // this regex should change http://website/otherJunk/blah --> website
      const urlRegex = new RegExp(/:\/\/(.*)\//);
      const urlMatch = url.match(urlRegex);

      // here we download the url given
      const text = await res.text();

      // this regex should change the HTML page from the original url
      // and find the element <link rel="icon" href="/dir/icon/here.png">
      // and return the path /dir/icon/here.png to append to the root website
      const favIconRegex = new RegExp(/<link rel=".*icon.*" href="(.*)">/i);
      const iconMatch = text.match(favIconRegex);

      const resolvedUrl = 'http://' + urlMatch![1] + iconMatch![1];

      res = await fetch(resolvedUrl);
      icon = await res.text();
    }
  } catch (err) {
    // better error handling needed
    console.log(err);
  }

  return icon;
}

export default function CompanyForm(props: CompanyProps) {
  return <div></div>;
}
