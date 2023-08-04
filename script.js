const form = document.getElementById('cloudFormationForm');
const output = document.getElementById('cloudFormationOutput');
const addIngressRuleButton = document.getElementById('addIngressRule');
const addEgressRuleButton = document.getElementById('addEgressRule');
const addTagButton = document.getElementById('addTag');
const ingressContainer = document.getElementById('ingressContainer');
const egressContainer = document.getElementById('egressContainer');
const tagsContainer = document.getElementById('tagsContainer');

addIngressRuleButton.addEventListener('click', function() {
  addRuleInputs(ingressContainer);
});

addEgressRuleButton.addEventListener('click', function() {
  addRuleInputs(egressContainer);
});

addTagButton.addEventListener('click', function() {
  addTagInputs();
});

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const vpcId = form.elements['vpcId'].value.trim();
  const groupDescription = form.elements['groupDescription'].value.trim();
  const ingressRules = collectRules(ingressContainer);
  const egressRules = collectRules(egressContainer);
  const tags = collectTags();

  const cloudFormationTemplate = generateCloudFormationTemplate(
    vpcId,
    groupDescription,
    ingressRules,
    egressRules,
    tags
  );
  output.textContent = cloudFormationTemplate;
});

function addRuleInputs(container) {
  const ruleDiv = document.createElement('div');
  ruleDiv.classList.add(container === ingressContainer ? 'ingressRule' : 'egressRule');
  ruleDiv.innerHTML = `
    <input type="text" name="${container === ingressContainer ? 'ingressIpProtocol[]' : 'egressIpProtocol[]'}" placeholder="IpProtocol (e.g., tcp)">
    <input type="number" name="${container === ingressContainer ? 'ingressFromPort[]' : 'egressFromPort[]'}" placeholder="FromPort">
    <input type="number" name="${container === ingressContainer ? 'ingressToPort[]' : 'egressToPort[]'}" placeholder="ToPort">
    <input type="text" name="${container === ingressContainer ? 'ingressCidrIp[]' : 'egressCidrIp[]'}" placeholder="CidrIp">
    <button type="button" class="removeRule">Remove ${container === ingressContainer ? 'Ingress' : 'Egress'} Rule</button>
  `;
  container.appendChild(ruleDiv);

  // Add event listener to the newly added remove button
  const removeRuleButton = ruleDiv.querySelector('.removeRule');
  removeRuleButton.addEventListener('click', function() {
    container.removeChild(ruleDiv);
  });
}

function addTagInputs() {
  const tagDiv = document.createElement('div');
  tagDiv.classList.add('tag');
  tagDiv.innerHTML = `
    <input type="text" name="tagKey[]" placeholder="Tag Key">
    <input type="text" name="tagValue[]" placeholder="Tag Value">
    <button type="button" class="removeTag">Remove Tag</button>
  `;
  tagsContainer.appendChild(tagDiv);

  // Add event listener to the newly added remove button
  const removeTagButton = tagDiv.querySelector('.removeTag');
  removeTagButton.addEventListener('click', function() {
    tagsContainer.removeChild(tagDiv);
  });
}

function collectRules(container) {
  const rules = [];
  const ruleDivs = container.getElementsByClassName(container === ingressContainer ? 'ingressRule' : 'egressRule');
  for (const ruleDiv of ruleDivs) {
    const ipProtocol = ruleDiv.querySelector(`input[name="${container === ingressContainer ? 'ingressIpProtocol[]' : 'egressIpProtocol[]'}"]`).value.trim();
    const fromPort = parseInt(ruleDiv.querySelector(`input[name="${container === ingressContainer ? 'ingressFromPort[]' : 'egressFromPort[]'}"]`).value.trim());
    const toPort = parseInt(ruleDiv.querySelector(`input[name="${container === ingressContainer ? 'ingressToPort[]' : 'egressToPort[]'}"]`).value.trim());
    const cidrIp = ruleDiv.querySelector(`input[name="${container === ingressContainer ? 'ingressCidrIp[]' : 'egressCidrIp[]'}"]`).value.trim();
    if (ipProtocol && !isNaN(fromPort) && !isNaN(toPort) && cidrIp) {
      rules.push({ IpProtocol: ipProtocol, FromPort: fromPort, ToPort: toPort, CidrIp: cidrIp });
    }
  }
  return rules;
}

function collectTags() {
  const tags = [];
  const tagDivs = tagsContainer.getElementsByClassName('tag');
  for (const tagDiv of tagDivs) {
    const tagKey = tagDiv.querySelector('input[name="tagKey[]"]').value.trim();
    const tagValue = tagDiv.querySelector('input[name="tagValue[]"]').value.trim();
    if (tagKey && tagValue) {
      tags.push({ Key: tagKey, Value: tagValue });
    }
  }
  return tags;
}

function generateCloudFormationTemplate(vpcId, groupDescription, ingressRules, egressRules, tags) {
  const tagEntries = tags.map(tag => {
    return { Key: tag.Key, Value: tag.Value };
  });

  return `AWSTemplateFormatVersion: 2010-09-09
Parameters:
  VpcId:
    Type: String
    Default: ${vpcId}
Resources:
  AlbSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: ${groupDescription}
      VpcId: !Ref VpcId
      SecurityGroupIngress:
${formatIngressEgress(ingressRules, 8)}
      SecurityGroupEgress:
${formatIngressEgress(egressRules, 8)}
      Tags:
${formatTags(tagEntries, 8)}`;
}

function formatIngressEgress(entries, indent) {
  const spaces = ' '.repeat(indent);
  return entries.map(entry => {
    return `${spaces}- IpProtocol: ${entry.IpProtocol}
${spaces}  FromPort: ${entry.FromPort}
${spaces}  ToPort: ${entry.ToPort}
${spaces}  CidrIp: ${entry.CidrIp}`;
  }).join('\n');
}

function formatTags(entries, indent) {
  const spaces = ' '.repeat(indent);
  return entries.map(entry => {
    return `${spaces}- Key: ${entry.Key}
${spaces}  Value: ${entry.Value}`;
  }).join('\n');
}

