---
title: Testing with Mark
date: 2026-04-27
layout: post
categories: ["cmstest", "dev"]
description: How I posted this post
thumbnail: /assets/images/656054248_951857007290471_1867212732135820190_n.jpg
image: /assets/images/656054248_951857007290471_1867212732135820190_n.jpg
---
I don't post to this website enough. It's hosted on Github pages, mainly because I'm cheap. Posting involves opening a terminal, which means I'm already in "work mode", which means it stops feeling like writing and starts feeling like a task.

The fix is cutting the number of steps between "I have something to write" and "it's live".

## What I wanted

Open a browser. Write something. Add a photo if I have one. Save it. Done. There's a 

That's it. No terminal, no git commands, no resizing images in a separate app, etc, etc

## What I built

There's a `[cms](/cms)` on this blog now. It's a pure JS app, no server, runs entirely in the browser, and it talks to GitHub directly. It lists the posts, lets me edit them with a preview next to the markdown, and handles photos. When I hit save it commits to the repo and the post goes live.

You authenticate with a GH personal access token, stored in local storage.

## The tech

Everything runs client-side because GitHub's API supports CORS, so you can `fetch` from it directly in a browser. Writing a file is one API call, you send the content base64-encoded with a commit message and a real git commit appears in the repo.

Photos get resized in the browser before upload using `OffscreenCanvas`, then committed to `assets/images/`.

There are tests. Unit tests mock the API calls and check the encoding is right. A separate integration suite actually hits GitHub, creates a file, reads it back, updates it, deletes it, and skips itself if you haven't set a token.

No framework, no build step, just ES modules. It runs straight off GitHub Pages.

This post was written in it, and this is a test post
