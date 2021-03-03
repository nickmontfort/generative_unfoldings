const { HostedModel } = require('@runwayml/hosted-models');

async function getText(prompt) {
  const rwmodel = new HostedModel({
    url: 'https://gpt-2-machine.hosted-models.runwayml.cloud/v1',
    token: 'dy9dytwK9ZOdTUenwZ/xYg==',
  });
  const result = await rwmodel.query({
    prompt: prompt,
  });
  return result;
}

module.exports.getText = getText
