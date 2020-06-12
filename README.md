[Hundter Biede's Personal Website](hbiede.com)
==============

## How To Use
* Fork this repo
* Edit the 'Author Info' section of `_config.yml`
* Replace the images in `assets/images/` as needed
* Add job entries to `jobs/_posts/` for all the jobs you wish to add to your resume
    (jobs are optional) (see template below for job files)
* Add project entries to `portfolio/_posts/` for all the projects you wish to add to
    your portfolio (projects are optional) (see template below for project files)
* Add blog posts to `blog/_posts/` for all the blog posts you wish to publish (blog is
    optional) (see template below for blog files)
* In your repository, go to Settings>GitHub Pages and set source to 'master branch'
  * Add a custom domain name if you own a domain you wish to use



### Job template
```
---
position: Job Title. (Optional. If none is given, the job title from the file name will be used)
company: Company of Employment (Optional)
link: link.to.the.company.site/
years: 2018-Present
tags: [Optional, Attributes, Of The Job, You Wish, To, Highlight]
---

* Description of job duties
* Can be formatted as any valid markdown
```
The above template should be saved to a file in `jobs/_posts/` and be named using the
start date of the job and the job title (e.g. `2018-09-17-Tax-Accountant.md`).

### Project Template
```
---
title: Project Title (Optional. If none is given, the project name from the file name will be used)
image: Link to an image you wish to display alongside the project (Optional) (e.g. /images/test.png if the iamge is in assets/images/ or https://example.com/test.png)
image-alt: Description of what is in the image linked above (Required if there is an image)
links:
  - name: Optional Set of Links to the project
    link: example.com/hello.html
  - name: Optional Second link
    link: google.com
summary: A brief summary of the project
description: A longer description of the project, some of the technologies/techniques used to make the project, etc.
tags: [Optional Tags, Describing, Technologies/Techniques, Used]
---
```
The above template should be saved to a file in `portfolio/_posts/` and be named using the
publish date of the project and the project name (e.g.
`2018-09-17-Community-Theater-Website.md`).

### Blog Template
```
---
layout: default (Required)
title: Post Title (Optional. If none is given, the post title from the file name will be used)
date: 2018-12-26T17:30:00Z (Optional. Used if you wish to associate a time of day with the post)
subtitle: Subtitle for the post (Optional)
---

Content of the blog as markdown
```
The above template should be saved to a file in `blog/_posts/` and be named using the
publish date of the post and the post title (e.g.
`2018-09-17-My-Story.md`).


Personal website based on a template by [Xiaoying Riley](https://themes.3rdwavemedia.com/).
