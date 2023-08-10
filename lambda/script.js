var editor = ace.edit("editor");
editor.setTheme("ace/theme/xcode"); // 设置主题
editor.getSession().setMode("ace/mode/python"); // 设置语言模式

// 显示行号和代码折叠
editor.renderer.setShowGutter(true);
editor.getSession().setUseWrapMode(true);

// 启用自动补全和括号匹配
ace.require("ace/ext/language_tools");
editor.setOptions({
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true
});

// 错误提示
editor.getSession().setUseWorker(true);

// 多光标编辑
editor.on("click", function () {
    editor.selection.clearSelection();
    editor.selection.addRange(new Range(1, 0, 2, 0));
    editor.selection.addRange(new Range(2, 0, 3, 0));
});

// 自定义插件示例：插入当前时间
editor.commands.addCommand({
    name: "insertDate",
    bindKey: { win: "Ctrl-Shift-D", mac: "Command-Shift-D" },
    exec: function (editor) {
        var date = new Date();
        editor.insert(date.toString());
    }
});


const form = document.getElementById('cloudFormationForm');
// const output = document.getElementById('cloudFormationOutput');

const outputEditor = ace.edit("cloudFormationOutput"); // 使用 Ace 编辑器来显示 CloudFormation 输出
outputEditor.setTheme("ace/theme/xcode");
outputEditor.getSession().setMode("ace/mode/yaml"); // 使用适当的语言模式（YAML）



form.addEventListener('submit', function(event) {
  event.preventDefault();
  // 获取用户输入的代码
  const InlineCode = editor.getValue();

  const FunctionName  = form.elements['FunctionName'].value.trim();
  const Runtime = form.elements['Runtime'].value.trim();
  const Role = form.elements['Role'].value.trim();
  const MemorySize = form.elements['MemorySize'].value.trim();
  const Timeout = form.elements['Timeout'].value.trim();
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
  // output.textContent = cloudFormationTemplate;
  outputEditor.setValue(cloudFormationTemplate); // 将生成的模板设置到 Ace 编辑器中显示
  outputEditor.clearSelection();
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
${addIndentation(InlineCode, 8)}      
      Role: ${Role}
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