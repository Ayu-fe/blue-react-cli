const program = require("commander");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");
const download = require("download-git-repo");
const ora = require("ora");
const chalk = require("chalk");

program
  .version("1.0.0")
  .description("生成器启动中")
  .option("-t, --template <template>", "GitHub 仓库")
  .action(() => {
    const templatesPath = path.join(__dirname, "config.json");

    const templateConfig = require(templatesPath);

    if (program.template) {
      // 生成
      createProjectByTemplate(program.template);
    } else {
      inquirer
        .prompt([
          {
            type: "list",
            name: "template",
            message: "请选择模板",
            choices: templateConfig.templates.map((item) => item.name),
          },
        ])
        .then((answers) => {
          const selectTemplate = templateConfig.templates.find(
            (i) => i.name === answers.template
          );
          createProjectByTemplate(selectTemplate.repo);
        });
    }
  });

program.parse(process.argv);

/**
 * 下载repo
 * @param {*} repo
 */
function createProjectByTemplate(repo) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "请输入name",
      },
      {
        type: "input",
        name: "projectName",
        message: "请输入项目名称",
      },
    ])
    .then((answers) => {
      const targetPath = path.join(process.cwd(), answers.projectName);

      const spinner = ora("下载中");
      spinner.start();

      setTimeout(() => {
        download(
          `direct:${repo}`,
          targetPath,
          { clone: true, checkout: "main" },
          (err) => {
            if (err) {
              spinner.fail(`出错了${err}`);
              return;
            }
            spinner.stop();
            console.log(chalk.green('模板下载成功'));

            // generateCode(targetPath, answers)
          }
        );
      }, 3000);
    });
}
