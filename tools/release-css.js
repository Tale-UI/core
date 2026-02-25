#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(rootDir, 'packages', 'css', 'package.json');
const packageName = '@cloudiverse/design-system';

function run(command, options = {}) {
    const { silent = false } = options;
    if (!silent) {
        console.log(`\n$ ${command}`);
    }
    return execSync(command, {
        cwd: rootDir,
        stdio: silent ? ['ignore', 'pipe', 'pipe'] : 'inherit',
        encoding: 'utf8'
    });
}

function getArgValue(flag) {
    const index = process.argv.indexOf(flag);
    if (index === -1) {
        return undefined;
    }
    return process.argv[index + 1];
}

function hasFlag(flag) {
    return process.argv.includes(flag);
}

function parseVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) {
        throw new Error(`Invalid semver version: ${version}`);
    }
    return {
        major: Number(match[1]),
        minor: Number(match[2]),
        patch: Number(match[3])
    };
}

function bumpVersion(currentVersion, bumpType) {
    const parsed = parseVersion(currentVersion);
    if (bumpType === 'patch') {
        parsed.patch += 1;
    } else if (bumpType === 'minor') {
        parsed.minor += 1;
        parsed.patch = 0;
    } else if (bumpType === 'major') {
        parsed.major += 1;
        parsed.minor = 0;
        parsed.patch = 0;
    } else {
        throw new Error(`Unsupported bump type: ${bumpType}`);
    }
    return `${parsed.major}.${parsed.minor}.${parsed.patch}`;
}

function ensureCleanWorkingTree() {
    run('git diff --quiet', { silent: true });
    run('git diff --cached --quiet', { silent: true });
}

function tagExistsLocally(tag) {
    try {
        run(`git rev-parse --verify refs/tags/${tag}`, { silent: true });
        return true;
    } catch {
        return false;
    }
}

function tagExistsRemotely(tag) {
    try {
        const output = run(`git ls-remote --tags origin refs/tags/${tag}`, { silent: true });
        return output.trim().length > 0;
    } catch {
        return false;
    }
}

function readPackageJson() {
    const raw = fs.readFileSync(packageJsonPath, 'utf8');
    return JSON.parse(raw);
}

function writePackageJson(contents) {
    fs.writeFileSync(packageJsonPath, `${JSON.stringify(contents, null, 2)}\n`, 'utf8');
}

function fail(message) {
    console.error(`\nRelease aborted: ${message}`);
    process.exit(1);
}

function main() {
    const explicitVersion = getArgValue('--version');
    const bumpType = getArgValue('--type') || 'patch';
    const dryRun = hasFlag('--dry-run');

    if (explicitVersion && getArgValue('--type')) {
        fail('Use either --version or --type, not both.');
    }

    if (!explicitVersion && !['patch', 'minor', 'major'].includes(bumpType)) {
        fail('`--type` must be one of: patch, minor, major.');
    }

    let pkg;
    try {
        ensureCleanWorkingTree();
        pkg = readPackageJson();
    } catch (error) {
        fail(error.message);
    }

    if (pkg.name !== packageName) {
        fail(`Unexpected package name in packages/css/package.json: ${pkg.name}`);
    }

    const currentVersion = pkg.version;
    const nextVersion = explicitVersion || bumpVersion(currentVersion, bumpType);
    const tag = `v${nextVersion}`;

    if (tagExistsLocally(tag) || tagExistsRemotely(tag)) {
        fail(`Tag ${tag} already exists. Choose a different version with --version (for example --version 1.0.2).`);
    }

    console.log('Preparing release');
    console.log(`- Package: ${packageName}`);
    console.log(`- Current version: ${currentVersion}`);
    console.log(`- Next version: ${nextVersion}`);
    console.log(`- Tag: ${tag}`);

    if (dryRun) {
        console.log('\nDry run enabled. No changes were made.');
        return;
    }

    try {
        pkg.version = nextVersion;
        writePackageJson(pkg);

        run(`pnpm --filter ${packageName} build`);
        run(`pnpm --filter ${packageName} publish --access public --no-git-checks`);

        run(`git add packages/css/package.json`);
        run(`git commit -m "release: ${packageName} v${nextVersion}"`);
        run(`git tag ${tag}`);
        run('git push');
        run(`git push origin ${tag}`);
        run(`gh release create ${tag} --title "${tag} - Publish to NPM" --notes "Release ${tag} of ${packageName}." --repo Tale-UI/core`);

        console.log('\nRelease complete. npm and GitHub are now aligned.');
    } catch (error) {
        fail(error.message);
    }
}

main();