---
layout: post
title: Email Parsing using ZOHO CRM
date: 2025-02-10 10:30:00 +0300
description: Parsing a Email using Email Parsing in ZOHO CRM to G-Sheet
img: https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal//EmailParsing.jpg
---

<h3>Introduction</h3>
Have you ever wondered of scraping data from an email and storing them in the database directly?.

Some of them would have tried and implemented it, some would have tried and for some of them this would be something new.

This workflow process is followed in most of the service/sales based companies involving purchases and orders.

<h3>What is Email Parsing?</h3>
Email Parsing is a process in which any software or third party application is used to extract data from the emails. In simpler words, its a automation method followed to read and extract data from emails.

Though there are many third party software applications, which offers this option. I had chosen Email Parsing by ZOHO CRM.

<h3>The Requirement</h3>
The requirement was quiet simple, parse the Data from the incoming emails, map them to their respective fields and store them in a database of your choice.

<h3>Prerequisites</h3>

- An Enterprise Account in ZOHO CRM.
- A Webhook API in any backend language
- A Database with proper field names

<h3>Steps Followed</h3>
1. Accessing Email Parser

    - Login to your ZOHO CRM account.
    - Go to Settings —> Channels —> Email
    - On the Top, click on Email Parser option (available only on Enterprise Mode)

1. Create a Parser Rule

    - When you first land on that page, it will ask you to send a email with the exact template you want to parse to a email id.

    ![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Screenshot%20(87).png)

    - Click on Parser Settings and add your email id to enable the parser to receive email from your email id.
    - Send a sample email with the exact template you want to parse in the future.
    - After sending the email, the CRM will receive the email and ask us to map the fields which you want to extract.
    - After mapping all the required fields, give the exact subject to filter the emails for parsing.
    - Click Next and click on Create a New Standalone Function.

    ![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Screenshot%20(91).png)

1. Write a Deluge Function

    - Write a function to read the extracted data from the email parsing and send them as a body to a webhook URL.
    - The function will get Saved only when the necessary parameters are provided and proper syntax is followed.

    ![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Screenshot%20(92).png)

1. Database

    - Though there are many databases available in today’s world, I choose Google Sheet as my database.
    - Create a New G-Sheet and input all the field names without any change in spelling.
    - To read data from the G-Sheet, go to Google Cloud Console and click on API & Services.
    - Click on Library from the Sidebar and find the Google Sheet API and enable it.

    ![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Screenshot%20(89).png)

    - After Enabling the API, click on + Create Credentials and choose Service Account.

    ![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Screenshot%20(90).png)

    - Enter the name for the account and click on create and continue.
    - IAM role is optional skip that and the next step and click on Done.
    - After creating a service account, create a key by clicking on create a new key and download the key as a JSON.
    - Now open the sheet where you want the access and click on share.
    - Add the service account email to this sheet.

1. Webhook API

    Now to write the data from the email parser to a G-Sheet we need a webhook API, which creates a integration between CRM and G-Sheet.
    Though there are many backend frameworks like Node.js, python, etc. I chose Next JS, since I was working on that framework.
    - The webhook should receive the body from the email parser and map the particular data to that particular field name and then write the data to the sheet.
    - We need the GOOGLE Service Account Credentials JSON and the spreadsheet ID.
    - Once it is hosted the webhook URL should be replaced be replaced in the Email Parser Deluge Function.
> The Field Names in the Email Parser should match the column field names in the sheet. Only then the data will fall in the required places.

Once all the steps are set up, send a different email to the email parser mail address, if everything works fine the data will be extracted and mapped to the fields names and stored in the G-Sheet.

![](https://ygileyiojgtkehmwllmy.supabase.co/storage/v1/object/public/personal/Blogs/Screenshot%20(94).png)

Once you automate that process, all the email with the subject provided will undergo the process and steps.

<h3>Advantages of Email Parsing</h3>
- Automating the process resulting in less manual work
- Numerous emails can be queued and can be parsed
- Minimalize data duplication

<h3>Disadvantages</h3>
- Handling the field format might be difficult. Particularly in the date format field.
- Emails with a slight difference in space or format might not get parsed.
- Multiple parser rule with the same template might not be possible.

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/
