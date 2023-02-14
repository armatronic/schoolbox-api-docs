#!/usr/bin/env node
const fs             = require("fs"),
      semver         = require('semver'),
      yaml           = require('yaml'),
      jsonSchemaDiff = require('json-schema-diff');

// Validate two version numbers are provided
if (process.argv.length < 4) {
    console.error("Two version numbers must be provided: exiting");
    process.exit(1);
}

// Add a line to builds.json
async function main() {
    const previousVersion = process.argv[2],
        currentVersion = process.argv[3],
        buildsFolder = __dirname + `/../docs/builds/`,
        previousVersionContents = yaml.parse(fs.readFileSync(buildsFolder + previousVersion + '.yaml').toString()),
        currentVersionContents = yaml.parse(fs.readFileSync(buildsFolder + currentVersion + '.yaml').toString());

    const result = await jsonSchemaDiff.diffSchemas({
        sourceSchema: previousVersionContents,
        destinationSchema: currentVersionContents,
    });
    console.log(
        yaml.stringify(result.removedJsonSchema),
        yaml.stringify(result.addedJsonSchema),
    );
}
main();
