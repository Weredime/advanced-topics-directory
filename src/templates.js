import fs from "fs";

const escapeRegExp = (str) => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

export function fetch() {
    const templates = fs.readdirSync("templates");
    const files = {}
    for (const template of templates) {
        files[template.split(".")[0]] = String(fs.readFileSync(`templates/${template}`));
    }

    return files
}

export function replace(template, replacers) {

    for (const i of Object.keys(replacers)) {
        template = template.replace(new RegExp(`\\{${escapeRegExp(i)}\\}`, 'i'), replacers[i])
    }

    return template;
}

