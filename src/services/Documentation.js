const fs = require('fs');
const path = require('path');
const assert = require('assert');
const StringUtil = require('../utility/StringUtil.js');
const Constants = require('../utility/Constants.js');

class Documentation {
  async createAndSave(registry) {
    let commandsDocumentation = 'All commands are catagorized by groups. Each of the following sections is a group.\n\nThe syntax of the command usage is:\n\n`Optional paramater: []`\n\n`Required paramater: <>`\n\n##Table Of Contents\n';

    let tableOfContents = '';
    let commandInfo = '';

    const groups = registry.groups.sort((a, b) => a.name.localeCompare(b.name));

    for (let i = 0; i < groups.length; i++) {
      const formattedGroupName = StringUtil.upperFirstChar(groups[i].name);

      tableOfContents += '- [' + formattedGroupName + '](#' + groups[i].name.toLowerCase() + ')\n';

      commandInfo += '\n### '+ formattedGroupName + '\n';

      if (StringUtil.isNullOrWhiteSpace(groups[i].description) === false) {
        commandInfo += '\n' + groups[i].description + '\n\n';
      }

      commandInfo += 'Command | Description | Usage\n---------------- | -------------- | -------\n';

      const commands = groups[i].commands.sort((a, b) => a.names[0].localeCompare(b.names[0]));

      for (let j = 0; j < commands.length; j++) {
        commandInfo += StringUtil.upperFirstChar(commands[j].names[0]) + '|' + commands[j].description + '|`' + Constants.prefix + commands[j].getUsage() + '`\n';
      }
    }

    commandsDocumentation += tableOfContents + commandInfo;

    fs.writeFile(path.join(__dirname, '../../docs/docs/commands.md'), commandsDocumentation, (err) => {
      assert.ifError(err);
    });
  }
}

module.exports = new Documentation();
