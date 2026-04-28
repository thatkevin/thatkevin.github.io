---
title: Announcing PAGER, and testing with Mark Corrigan
date: 2026-04-27
layout: post
categories: ["Dev", "CMS Test"]
description: How I posted this post
thumbnail: /assets/images/656054248_951857007290471_1867212732135820190_n.jpg
image: /assets/images/656054248_951857007290471_1867212732135820190_n.jpg
---
I don't post to this website enough. Posting involves opening a terminal, which means I'm already in "work mode", which means it stops feeling like writing and starts feeling like a task.

The fix is cutting the number of steps between "I have something to write" and "it's live"

## Github pages

It's hosted on Github pages, mainly because it's free, I'm a cheapskate, and I don't have to maintain it. that's my day job, not what I want to do more of in my fun time. If you have [Jekyll](https://jekyllrb.com/) on it, you are just editing markdown files.

## What I wanted

Open a browser, write something. Add a photo if I have one. Save it, and done.

No terminal, no git commands, no resizing images in a separate app

## What I built

I've made a static JS app at [pager.kev.cc](pager.kev.cc). It's a pure JS app, no server, runs entirely in the browser, and it talks to GitHub directly. It lists any Jekyll-style markdown posts in the repo, lets me edit them with a preview next to the markdown, and handles photos. When I hit save it commits to the repo and the post goes live.

You can authenticate with a GH personal access token, stored in local storage, or I've put a cloudflare worker to handle a GitHub device login.

![Screenshot of PAGER](/assets/images/paste-1777378709042.png)

## The tech

Everything runs client-side because GitHub's API supports CORS, so you can `fetch` from it directly in a browser. Writing a file is one API call, you send the content base64-encoded with a commit message and a real git commit appears in the repo.

Photos get resized in the browser before upload using `OffscreenCanvas`, then committed to `assets/images/`.

It runs straight off GitHub Pages, or wherever you host your static html.

## The code

It's at [https://github.com/thatkevin/pager](PAGER) and the auth repo is at [https://github.com/thatkevin/pager-auth](pager-auth).

## Why Mark Corrigan?

Er, it was the first picture I found, so he's making a guest appearance

This post was written in it, and this is a test post!
