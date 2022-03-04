import fs from "fs/promises";
import { fetch as templaterFetch, replace as templaterReplace } from "./templates.js"
import topicData from "./topic-data.js";

const templates = templaterFetch()

const builtPosts = {}
const categories = await fs.readdir("category");
for (const categoryName of categories) {
    let categoryPosts = ""
    const posts = await fs.readdir(`category/${categoryName}`);
    for (const postF of posts) {
        const id = Number(postF.match(/([0-9]+).json/)[1]);
        const { title, author } = await topicData(id)
        
        const post = templaterReplace(templates.topic, {
            title,
            description: JSON.parse(await fs.readFile(`category/${categoryName}/${postF}`)).description,
            id,
            author
        })

        categoryPosts += post + "\n"
        console.log("Built topic", id, "by", author, "(" + title + ")")
    }
    builtPosts[({
        "Scratch Mods": 5631864,
        "General Discussion": 5631870,
        "Programs and Apps": 5631878,
        "Questions": 5631882,
        "Guides": 5631885,
        "Miscallaneous": 5631887
    })[categoryName]] = templaterReplace(templates.category, {
        posts: categoryPosts,
        length: posts.length,
        name: categoryName,
    })
}

for (const id of Object.keys(builtPosts)) {
    await fs.writeFile(`dist/${id}.bbcode`, builtPosts[id])
}