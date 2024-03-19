import {
  Discord,
  SimpleCommand,
  SimpleCommandMessage,
  SimpleCommandOption,
  SimpleCommandOptionType
} from 'discordx';
import { exec } from 'node:child_process';
import { inspect, promisify } from 'node:util';

const execAsync = promisify(exec);

@Discord()
export class Owner {
  codeBlock(code: string, language = 'js') {
    return `\`\`\`${language}\n${code}\n\`\`\``;
  }

  cleanCode(code: string): string {
    const match = /^```(\S*)\n?([^]*)\n?```$/.exec(code);
    if (!match) return code;
    return match[1];
  }

  @SimpleCommand({ aliases: ['ev'], argSplitter: '........' })
  async eval(
    @SimpleCommandOption({
      name: 'code',
      description: 'Code to evaluate',
      type: SimpleCommandOptionType.String
    })
    code: string,
    command: SimpleCommandMessage
  ) {
    if (command.message.author.id !== '292690616285134850') return;
    if (!command.isValid()) return command.sendUsageSyntax();

    const clean = this.cleanCode(code);

    try {
      const results = await eval(clean);
      const output = inspect(results, { depth: 0, maxArrayLength: null });

      if (output.length < 1990) {
        return command.message.reply(this.codeBlock(output));
      } else {
        return command.message.reply('Output too long to send');
      }
    } catch (err: any) {
      return command.message.reply(this.codeBlock(err.toString()));
    }
  }

  @SimpleCommand({
    description: 'Execute shell commands.',
    aliases: ['ex'],
    argSplitter: '........'
  })
  async exec(
    @SimpleCommandOption({
      name: 'code',
      description: 'Code to execute',
      type: SimpleCommandOptionType.String
    })
    code: string,
    command: SimpleCommandMessage
  ) {
    if (command.message.author.id !== '292690616285134850') return;
    if (!command.isValid()) return command.sendUsageSyntax();
    const clean = this.cleanCode(code);

    const result = await execAsync(clean, {
      timeout: 60000
    }).catch((error) => ({ stdout: null, stderr: error }));

    const output = result.stdout ? `**\`OUTPUT\`**${'```prolog\n' + result.stdout + '```'}` : '';
    const outerr = result.stderr ? `**\`ERROR\`**${'```prolog\n' + result.stderr + '```'}` : '';

    if (output === '' && outerr === '') {
      return command.message.reply('No output returned.');
    }

    const results = [output, outerr].join('\n');

    if (results.length > 2000) {
      return command.message.reply('Output too long to send.');
    }

    return command.message.reply(results);
  }
}
