const createSecurityGroupButton = document.getElementById('createSecurityGroup');
const createEC2InstanceButton = document.getElementById('createEC2Instance'); 

createSecurityGroupButton.addEventListener('click', function() {
  window.location.href = 'securitygroup/securitygroup.html';
});

createEC2InstanceButton.addEventListener('click', function() {
  window.location.href = 'ec2/ec2.html';
});
