import fetch from "node-fetch";
import {parse} from "node-html-parser";

/**
 * Fetches a topic, and returns the username of the topic author.
 * @param {number} id Topic identifier corresponding to the to-fetch topic.
 * @returns {string} The username of the topic author.
 */
export default async function(id) {
    const res = await fetch(`https://scratch.mit.edu/discuss/topic/${id}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0"
        }
    });

    const text = await res.text();

    const dom = parse(text);
    const post = dom.querySelector(".blockpost"); // first post

    const user = post.querySelector(".username").innerText;
    const title = dom.querySelector(".linkst > ul li:nth-child(3)").innerText.replace("&raquo; ", "").trim();


    return { author: user, title };
}