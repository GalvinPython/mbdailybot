/**
 * This code is for the latest version of the bot
 * This code is no longer used, and doesn't include the Discord updates that were made to private chats
 */

import { CronJob } from "cron";
import { promises as fs } from 'fs';

let latestUpdate;

const job = new CronJob('0 0 0 * * *', async function () {
    // Saves the actual confirmed subscriber count
    await fetch("https://nia-statistics.com/api/get?platform=youtube&type=channel&id=UCX6OQ3DkcsbYNE6H8uQQuVA")
        .then(res => res.json())
        .then(async data => {
            latestUpdate = parseInt(data.estSubCount);

            // Read the JSON file to get the latest saved subscriber count
            const fileData = await fs.readFile('latestMrBeastConfirmed.json', 'utf-8');
            const parsedFileData = JSON.parse(fileData);
            const latestSavedSubs = parsedFileData.subs;

            const difference = latestUpdate - latestSavedSubs;
            const tweetText = `Update for ${new Date(new Date().getTime() - 1000 * 60 * 60).toLocaleDateString()}\nConfirmed subscriber count: ${latestUpdate.toLocaleString()}\nDifference: ${difference}`;

            // Make Tweet
            await fetch(`https://twitter.com/i/api/graphql/${process.env.QUERY_ID}/CreateTweet`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA", // Every Twitter account has the same bearer token
                    "content-type": "application/json",
                    "priority": "u=1, i",
                    "sec-ch-ua": "\"Chromium\";v=\"119\", \"Not?A_Brand\";v=\"24\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-client-transaction-id": process.env.CLIENT_TRANSACTION_ID,
                    "x-client-uuid": process.env.CLIENT_UUID,
                    "x-csrf-token": process.env.CSRF_TOKEN,
                    "x-twitter-active-user": "yes",
                    "x-twitter-auth-type": "OAuth2Session",
                    "x-twitter-client-language": "en",
                    "cookie": process.env.COOKIE,
                    "Referer": "https://twitter.com/compose/tweet",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": JSON.stringify({
                    "variables": {
                        "tweet_text": tweetText,
                        "dark_request": false,
                        "media": {
                            "media_entities": [],
                            "possibly_sensitive": false
                        },
                        "semantic_annotation_ids": []
                    },
                    "features": {
                        "c9s_tweet_anatomy_moderator_badge_enabled": true,
                        "tweetypie_unmention_optimization_enabled": true,
                        "responsive_web_edit_tweet_api_enabled": true,
                        "graphql_is_translatable_rweb_tweet_is_translatable_enabled": true,
                        "view_counts_everywhere_api_enabled": true,
                        "longform_notetweets_consumption_enabled": true,
                        "responsive_web_twitter_article_tweet_consumption_enabled": true,
                        "tweet_awards_web_tipping_enabled": false,
                        "longform_notetweets_rich_text_read_enabled": true,
                        "longform_notetweets_inline_media_enabled": true,
                        "rweb_video_timestamps_enabled": true,
                        "responsive_web_graphql_exclude_directive_enabled": true,
                        "verified_phone_label_enabled": false,
                        "freedom_of_speech_not_reach_fetch_enabled": true,
                        "standardized_nudges_misinfo": true,
                        "tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled": true,
                        "responsive_web_media_download_video_enabled": false,
                        "responsive_web_graphql_skip_user_profile_image_extensions_enabled": false,
                        "responsive_web_graphql_timeline_navigation_enabled": true,
                        "responsive_web_enhance_cards_enabled": false
                    },
                    "queryId": process.env.QUERY_ID
                }),
                "method": "POST"
            });

            // Send update message to Discord
            fetch(`https://discord.com/api/v9/channels/${process.env.DISCORD_CHANNEL_UPDATE}/messages`, {
                "headers": {
                    "accept": "*/*",
                    "accept-language": "en-GB",
                    "authorization": process.env.DISCORD_TOKEN,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-debug-options": "bugReporterEnabled",
                    "x-discord-locale": "en-GB",
                    "x-discord-timezone": "Europe/London",
                    "x-super-properties": "",
                    "cookie": "",
                    "Referer": "",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                "body": `{\"mobile_network_type\":\"unknown\",\"content\":\"**MrBeast Subscriber Update**\n\n${tweetText}\nDifference: ${difference}\",\"tts\":false,\"flags\":0}`,
                "method": "POST"
            });

            // Update latestMrBeastConfirmed.json with the latest subscriber count
            parsedFileData.subs = latestUpdate;
            await fs.writeFile('latestMrBeastConfirmed.json', JSON.stringify(parsedFileData));
        });
});

console.log("online");
job.start();
