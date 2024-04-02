document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('rdsForm');
  const output = document.getElementById('rdsCloudFormationOutput');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const params = {
      DBInstanceIdentifier: document.getElementById('DBInstanceIdentifier').value,
      DBName: document.getElementById('DBName').value,
      Engine: document.getElementById('Engine').value,
      // EngineVersion: document.getElementById('EngineVersion').value,
      MasterUsername: document.getElementById('MasterUsername').value,
      MasterUserPassword: document.getElementById('MasterUserPassword').value,
      PubliclyAccessible: document.getElementById('PubliclyAccessible').checked,
      MultiAZ: document.getElementById('MultiAZ').checked,
      DBSubnetGroupName: document.getElementById('DBSubnetGroupName').value,
      StorageType: document.getElementById('StorageType').value,
      AllocatedStorage: document.getElementById('AllocatedStorage').value,
      InstanceClass: document.getElementById('InstanceClass').value,
      BackupRetentionPeriod: document.getElementById('BackupRetentionPeriod').value,
      VPCSecurityGroupId: document.getElementById('VPCSecurityGroupId').value
    };

    const template = generateCloudFormationTemplate(params);
    output.textContent = template;
  });

  function generateCloudFormationTemplate(params) {
    return `
Resources:
  RDSInstance:
    Type: AWS::RDS::DBInstance
    Properties:
      AllocatedStorage: ${params.AllocatedStorage}
      DBInstanceClass: ${params.InstanceClass}
      DBName: ${params.DBName}
      Engine: ${params.Engine}
      MasterUsername: ${params.MasterUsername}
      MasterUserPassword: ${params.MasterUserPassword}
      PubliclyAccessible: ${params.PubliclyAccessible}
      MultiAZ: ${params.MultiAZ}
      StorageType: ${params.StorageType}
      DBSubnetGroupName: ${params.DBSubnetGroupName}
      VPCSecurityGroups:
        - ${params.VPCSecurityGroupId}
      BackupRetentionPeriod: ${params.BackupRetentionPeriod}
      DBInstanceIdentifier: ${params.DBInstanceIdentifier}
`.trim();
  }
});
