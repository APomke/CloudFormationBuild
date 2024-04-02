const createSecurityGroupButton = document.getElementById('createSecurityGroup');
const createEC2InstanceButton = document.getElementById('createEC2Instance'); 
const createLambdaButton = document.getElementById('createLambda'); 
const createRDSInstanceButton = document.getElementById('createRDSInstance'); 

createSecurityGroupButton.addEventListener('click', function() {
  window.location.href = 'securitygroup/securitygroup.html';
});

createEC2InstanceButton.addEventListener('click', function() {
  window.location.href = 'ec2/ec2.html';
});

createLambdaButton.addEventListener('click', function() {
  window.location.href = 'lambda/lambda.html';
});

createRDSInstanceButton.addEventListener('click', function() {
  window.location.href = 'rds/rds.html';
});