GIT_ROOT=$(git rev-parse --show-toplevel)

rm -f "$GIT_ROOT/.env.patch"
rm -f "$GIT_ROOT/.env.latest"

gcloud secrets versions access latest --secret=web-env-file --project=e2e-poc-web > $GIT_ROOT/.env.latest

if [ ! -f "$GIT_ROOT/.env" ]; then
    mv "$GIT_ROOT/.env.latest" "$GIT_ROOT/.env"
    exit 0
fi


diff -u $GIT_ROOT/.env $GIT_ROOT/.env.latest > $GIT_ROOT/.env.diff

if [ ! -s "$GIT_ROOT/.env.patch" ]; then
    rm -f "$GIT_ROOT/.env.patch"
    mv "$GIT_ROOT/.env.latest" "$GIT_ROOT/.env"
    exit 0
fi

if [ "$1" = "--ci-mode" ] || [ "$1" = "-ci" ]; then
    echo "Error: Environment file mismatch detected in CI mode. Please resolve differences locally."
    exit 1
fi

echo "Latest env from secrets does not match current env. Resolve differences shown in .env.diff locally and push the correct version to secrets"
