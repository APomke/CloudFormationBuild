const form = document.getElementById('cloudFormationForm');
const output = document.getElementById('cloudFormationOutput');

form.addEventListener('submit', function(event) {
  event.preventDefault();
  const InstanceType  = form.elements['InstanceType'].value.trim();
  const AMI_ID = form.elements['AMI ID'].value.trim();
  const SubnetId = form.elements['SubnetId'].value.trim();
  const SecurityGroupId = form.elements['SecurityGroupId'].value.trim();
  const KeyName = form.elements['KeyName'].value.trim();
  const RoleName = form.elements['RoleName'].value.trim();
  const VolumeSize = form.elements['VolumeSize'].value.trim();

  const cloudFormationTemplate = generateCloudFormationTemplate(
    InstanceType,
    AMI_ID,
    SubnetId,
    SecurityGroupId,
    KeyName,
    RoleName,
    VolumeSize
  );
  output.textContent = cloudFormationTemplate;
});

function generateCloudFormationTemplate(InstanceType, AMI_ID, SubnetId, SecurityGroupId, KeyName,RoleName,VolumeSize) {

  return `AWSTemplateFormatVersion: 2010-09-09
Resources:
  EC2Instance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: ${InstanceType}
      ImageId: ${AMI_ID}
      SubnetId: ${SubnetId}
      SecurityGroupIds:
        - ${SecurityGroupId}
      KeyName: ${KeyName}
      IamInstanceProfile: ${RoleName}
      BlockDeviceMappings:
        - DeviceName: /dev/xvda
          Ebs:
            VolumeSize: ${VolumeSize}`;
}
