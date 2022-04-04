## MariaDB 10.7.x Import Corruption Bug

I am seeing corrupted entries on MariaDB 10.7.x and 10.8.x when importing a mysqldump file of client data generated from Percona Server MySQL Percona Server 5.7.36-39.

The same file imports correctly on earlier versions from 10.6.7 and down.

I have reduced the dumpfile to one very-long `INSERT INTO` statement on a single table. (6259 values in 1005050 characters, 1007213 bytes on disk)

When imported by MariaDB 10.7.x via the official Docker image, _some_ `LONGTEXT` entries will be entirely replaced with `\0` null-control characters.

I have spent days working to further reduce the file to the point where I could scrub client data and share without luck.

What I have is a modified dumnpfile4 with a one-line Inert Into statement that imports correctly at 1005049 characters, but fails with corrupted entries at 1005050 characters. The command is 33 characters, `INSERT INTO `wp_postmeta`VALUES`, so the actual insertion values import correctly at 1005009 characters, but corrupt if any character is added to push toital value length to 1005010.

The file has been scrubbed a little:

- All tables but one have been removed
- All control-characters and extended unicode characters have been removed (non-breaking spaces, typographic quotes and dashes, emojis)

Maddening details

- Changing the order values (random manual moves) _may_ cause the file to import correctly
- Failures are silent, only noticed by looking at specific fields which

## Tests and Tools

The MariaDB version can be set with an environment variable in the command. This will run the test using MariaDB 10.7.3"

```sh
MARIADB=10.7.3 docker compose run --rm test
```

Docker commands are wrapped in npm scripts:

- `npm run fail` will run the tests with MariaDB 10.7.3 and fails
- `npm run pass` will run the tests with MariaDB 10.6.7 and passes
- `npm run test` will run both tests

Tests can be run when the SQL file changes by running these commands:

- `npm run watch:pass` re-runs the failing test on MariaDB 10.6.7 when _db/mysql.sql_ changes
- `npm run watch:fail` re-runs the failing test on MariaDB 10.7.3 when _db/mysql.sql_ changes
- `npm run watch:test` re-runs both test when _db/mysql.sql_ changes
