swarm_command=cat ./swarmCommand.sh
if [ -z "$swarm_command" ] 
then
    echo "Waiting..."
else
	sh ./swarmCommand.sh
    echo "New Swarm Command:"
    echo $swarm_command
fi
