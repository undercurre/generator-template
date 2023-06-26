var Generator = require('yeoman-generator')
const figlet = require('figlet')
const { promisify } = require('util')
const libconfig = require('../app/libconfig')
const downloadGitRepo = require('download-git-repo')
const ora = require('ora')

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts)

    // Next, add your custom code
    // this.option('babel') // This method adds support for a `--babel` flag
  }
  async prompting() {
    console.log(
      '\r\n' +
        figlet.textSync('Matrix', {
          font: 'Ghost',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true,
        })
    )
    const hello = await this.prompt([
      {
        type: 'list',
        name: 'purpose',
        message: 'Select your purpose',
        choices: [
          {
            name: 'basic',
            value: 'basic',
            description: 'I need a basic template',
          },
          {
            name: 'business',
            value: 'business',
            description: 'I need a business template',
          },
          {
            name: 'tool',
            value: 'tool',
            description: 'I need a tool template',
          },
        ],
      },
    ])
    let chose = null
    if (hello.purpose === 'basic') {
      const basic = await this.prompt([
        {
          type: 'checkbox',
          name: 'carrier',
          message: 'Select your carrier',
          choices: [
            {
              name: 'web',
              value: 'web',
              description: 'I need a web template',
            },
            {
              name: 'app',
              value: 'app',
              description: 'I need a app template',
            },
            {
              name: 'desktop',
              value: 'desktop',
              description: 'I need a desktop template',
            },
            {
              name: 'miniprogram',
              value: 'miniprogram',
              description: 'I need a miniprogram template',
            },
            {
              name: 'weex',
              value: 'weex',
              description: 'I need a miniprogram template',
            },
            {
              name: 'flutter',
              value: 'flutter',
              description: 'I need a flutter template',
            },
          ],
        },
      ])
      chose = basic.basic
    }
    if (hello.purpose === 'business') {
      const business = await this.prompt([
        {
          type: 'list',
          name: 'business',
          message: 'Select your purpose',
          choices: [
            {
              name: 'questionnaire_outline',
              value: 'questionnaire_outline',
              description: 'A questionnaire with strapi outline',
            },
            {
              name: 'questionnaire_online',
              value: 'questionnaire_online',
              description: 'A questionnaire with strapi online',
            },
            {
              name: 'aromatherapy',
              value: 'aromatherapy',
              description: 'A car aromatherapy outline',
            },
            {
              name: 'scale',
              value: 'scale',
              description: 'A body fat scale with weex in Meiju',
            },
          ],
        },
      ])
      chose = business.business
    }
    if (hello.purpose === 'tool') {
      const tool = await this.prompt([
        {
          type: 'list',
          name: 'tool',
          message: 'Select tool type',
          choices: [
            {
              name: 'cli',
              value: 'cli',
              description: 'A template for cli',
            },
            {
              name: 'component',
              value: 'component',
              description: 'A template for component library',
            },
          ],
        },
      ])
      chose = tool.tool
    }
    const config = await this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname, // Default to current folder name
      },
    ])
    this.answers = {
      purpose: hello.purpose,
      chose,
      config,
    }
  }
  async writing() {
    const spinner = ora('loading')
    console.log(this.answers)
    const { owner, repo, branch } =
      libconfig[this.answers.purpose][this.answers.chose] // 从用户的答案中获取 owner、repo 和 branch
    const url = `${owner}/${repo}#${branch}`
    const path = `./${this.answers.config.name}`
    console.log(url, path)
    try {
      const fetchMethod = promisify(downloadGitRepo)
      spinner.start()
      await fetchMethod(url, path)
      spinner.succeed()
    } catch (e) {
      spinner.fail('Request failed, refetch ...')
    }
  }
}
