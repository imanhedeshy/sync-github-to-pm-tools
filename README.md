
# Sync GitHub Issues to Project Management Tools

This project provides a set of tools to synchronize GitHub issues with various project management tools like Asana, Jira, Monday.com, and Trello.

## Usage

To use these scripts, first set up your environment variables in a `.env` file at the root of the project, then run the `app.ts` script with the desired project management tool and the GitHub repository address as arguments.

```bash
node dist/app.js --tool=<tool_name> --repo=<username/repo>
```

Replace `<tool_name>` with one of `asana`, `jira`, `monday`, or `trello` and `<username/repo>` with the GitHub repository you want to sync.

## Installation

- Clone the repository
- Run `npm install` to install dependencies
- Compile TypeScript files with `npx tsc`
- Run the synchronization script as shown above

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
