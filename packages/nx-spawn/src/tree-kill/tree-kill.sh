#!/bin/bash

# Adapted from https://github.com/vuejs/vue-cli/blob/e63681735f01e5f22f0791251683c8418aa2aa8e/packages/@vue/cli-ui/apollo-server/util/terminate.sh

terminateTree() {
    local pid=$1
    local signal=$2
    for cpid in $(/usr/bin/pgrep -P $pid); do
        terminateTree $cpid $signal
    done

    # There's a couple reasons we may not want to kill a given PID:
    # - It's already been killed by killing one of its children
    # - It's this script
    if ps -p $pid > /dev/null && test $pid -ne $$
    then
      kill -$signal $pid > /dev/null 2>&1
    fi
}

terminateTree $1 $2
