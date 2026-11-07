#!/usr/bin/env bash
# Verifies the asset links file that is actually being served, the way Android's verifier sees it:
# HTTP 200 with no redirect, a JSON content type, and exactly the bytes committed in the repository.
#
# Usage: scripts/verify-live-assetlinks.sh <url> <expected-file> [attempts] [delay-seconds]
#
# It retries because a fresh Pages deployment and the CDN cache (max-age 600) take a few minutes
# to converge; the defaults wait up to ~11 minutes before failing.
set -euo pipefail

url="${1:?usage: $0 <url> <expected-file> [attempts] [delay-seconds]}"
expected_file="${2:?usage: $0 <url> <expected-file> [attempts] [delay-seconds]}"
attempts="${3:-45}"
delay="${4:-15}"

expected_sha="$(sha256sum "$expected_file" | cut -d' ' -f1)"
body="$(mktemp)"
trap 'rm -f "$body"' EXIT

for ((i = 1; i <= attempts; i++)); do
  # No -L: a redirect is a failure, Android does not follow redirects for assetlinks.json.
  read -r status content_type < <(
    curl --silent --show-error --max-time 20 --output "$body" \
      --write-out '%{http_code} %{content_type}\n' "$url" || echo "000 -"
  )
  actual_sha="$(sha256sum "$body" | cut -d' ' -f1)"

  problems=()
  [[ "$status" == "200" ]] || problems+=("HTTP $status")
  [[ "$content_type" == application/json* ]] || problems+=("content type '$content_type'")
  [[ "$actual_sha" == "$expected_sha" ]] || problems+=("sha256 $actual_sha != $expected_sha")

  if ((${#problems[@]} == 0)); then
    echo "OK: $url (HTTP $status, $content_type, sha256 $actual_sha)"
    exit 0
  fi
  echo "attempt $i/$attempts: ${problems[*]}"
  ((i < attempts)) && sleep "$delay"
done

echo "::error::$url is not serving the expected asset links file"
exit 1
