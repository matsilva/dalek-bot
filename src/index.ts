#!/usr/bin/env node
import { main } from './lib/main';

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
