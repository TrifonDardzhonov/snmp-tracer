swarm_command=cat ./swarmCommand.sh
if [ -z "$swarm_command" ] 
then
    echo "Waiting..."
    cat /dev/null > ./swarmCommand.sh
else
	sh ./swarmCommand.sh || cat /dev/null > ./swarmCommand.sh
    cat /dev/null > ./swarmCommand.sh
    echo "New Swarm Command:"
    echo $swarm_command
fi
