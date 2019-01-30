swarm_command=$(sudo ./Server/swarmCommand.sh )
if [ "$swarm_command" ] 
then
    echo "Waiting..."
    echo "$swarm_command" >> "correct.txt"
    cat /dev/null > ./Server/swarmCommand.sh
else
	sh ./swarmCommand.sh || cat /dev/null > ./swarmCommand.sh
    cat /dev/null > ./Server/swarmCommand.sh
    echo "New Swarm Command:"
fi