#!/bin/bash

# For each entrypoint
for dir in dist/functions/*/; do

    # Entrypoint name    
    entrypoint=$(basename $dir)

    # Package the entrypoint source
    zip -r -j dist/functions/$entrypoint.zip $dir

done
