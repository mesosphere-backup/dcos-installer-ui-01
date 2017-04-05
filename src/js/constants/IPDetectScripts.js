let awsScript = `#!/bin/sh
set -o nounset -o errexit

# Get COREOS COREOS_PRIVATE_IPV4
if [ -e /etc/environment ]
then
  set -o allexport
  source /etc/environment
  set +o allexport
fi

get_private_ip_from_metaserver()
{
    curl -fsSL http://169.254.169.254/latest/meta-data/local-ipv4
}

echo -n \${COREOS_PRIVATE_IPV4:-$(get_private_ip_from_metaserver)}`;

let azureScript = `#!/bin/sh
set -o nounset -o errexit

# Get COREOS COREOS_PRIVATE_IPV4
if [ -e /etc/environment ]
then
  set -o allexport
  . /etc/environment
  set +o allexport
fi

# Get the IP address of the interface specified by $1
get_ip_from_interface()
{
  /sbin/ifconfig "$1" | awk '/(inet addr)/ { print $2 }' | cut -d":" -f2 | head -1
}

echo -n \${COREOS_PRIVATE_IPV4:-$(get_ip_from_interface eth0)}`;

let gceScript = `#!/bin/sh
# Example ip-detect script using an external authority
# Uses the GCE Metadata Service to get the node's internal
# ipv4 address

curl -fsSl -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/network-interfaces/0/ip`;

const IP_DETECT_SCRIPTS = {
  aws: awsScript,
  azure: azureScript,
  gce: gceScript
};

module.exports = IP_DETECT_SCRIPTS;
