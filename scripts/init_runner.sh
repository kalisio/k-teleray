#!/usr/bin/env bash
set -euo pipefail
# set -x

JOB_ID=$1

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_DIR=$(dirname "$THIS_FILE")
# ROOT_DIR=$(dirname "$THIS_DIR")

. "$THIS_DIR/kash/kash.sh"

### Github Actions

init_github_build() {
    install_reqs age sops nvm node16
}

init_github_main_ci() {
    install_reqs age sops nvm node16 node18 mongo4
}

begin_group "Init $CI_ID for $JOB_ID"

init_"${CI_ID}_${JOB_ID}"

end_group "Init $CI_ID for $JOB_ID"
