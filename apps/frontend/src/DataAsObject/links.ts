const ec2 = true;
export let link = "https://ec2-18-221-74-82.us-east-2.compute.amazonaws.com";
if (!ec2) {
  link = "http://localhost:3000";
}
