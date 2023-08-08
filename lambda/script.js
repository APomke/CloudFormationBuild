const form = document.getElementById('cloudFormationForm');
const output = document.getElementById('cloudFormationOutput');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const FunctionName  = form.elements['FunctionName'].value.trim();
  const Runtime = form.elements['Runtime'].value.trim();
  const Role = form.elements['Role'].value.trim();
  const MemorySize = form.elements['MemorySize'].value.trim();
  const Timeout = form.elements['Timeout'].value.trim();
  const InlineCode = form.elements['InlineCode'].value.trim();
  // const Handler = form.elements['Handler'].value.trim();
  const Description = form.elements['Description'].value.trim();

  const cloudFormationTemplate = generateCloudFormationTemplate(
    FunctionName,
    Description,
    Runtime,
    Role,
    MemorySize,
    Timeout,
    // Handler,
    InlineCode
  );
  output.textContent = cloudFormationTemplate;
});

function generateCloudFormationTemplate(FunctionName, Description, Runtime, Role, MemorySize, Timeout, InlineCode) {
  return `AWSTemplateFormatVersion: 2010-09-09
Transform: AWS::Serverless-2016-10-31
Resources:
  LambdaFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.lambda_handler
      Description: ${Description}
      Runtime: ${Runtime}
      InlineCode: |
${addIndentation(InlineCode, 8)}      Role: ${Role}
      MemorySize: ${MemorySize}
      Timeout: ${Timeout}
      FunctionName: ${FunctionName}`;
}

function addIndentation(text, spaces) {
  return text
    .split('\n')
    .map(line => ' '.repeat(spaces) + line)
    .join('\n');
}