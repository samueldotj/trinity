"""Print a batch run's status now and every N minutes until the batch ends.

    python scripts/batch_status.py --run 4 --every 15
"""
import argparse
import sys
import time
from datetime import datetime
from pathlib import Path

import anthropic

sys.path.insert(0, str(Path(__file__).parent))
from qa_common import qa_db  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--run", type=int, required=True)
    ap.add_argument("--every", type=float, default=15, help="minutes between checks")
    args = ap.parse_args()
    batch_id = qa_db().execute("SELECT batch_id FROM runs WHERE id = ?", (args.run,)).fetchone()["batch_id"]
    client = anthropic.Anthropic()
    while True:
        now = datetime.now().strftime("%H:%M")
        try:
            b = client.messages.batches.retrieve(batch_id)
            c = b.request_counts
            total = c.processing + c.succeeded + c.errored + c.canceled + c.expired
            done = total - c.processing
            print(f"{now} run {args.run}: {b.processing_status}, {done}/{total} done "
                  f"({c.succeeded} succeeded, {c.errored} errored, {c.expired} expired, {c.canceled} canceled)",
                  flush=True)
            if b.processing_status == "ended":
                print(f"{now} run {args.run}: BATCH ENDED", flush=True)
                return
        except anthropic.APIError as e:  # transient failure: report and keep polling
            print(f"{now} run {args.run}: status check failed ({e.__class__.__name__})", flush=True)
        time.sleep(args.every * 60)


if __name__ == "__main__":
    main()
