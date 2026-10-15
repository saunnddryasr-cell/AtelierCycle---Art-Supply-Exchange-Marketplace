/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { startServer } from './backend/server';

startServer().catch((err) => {
  console.error('[Root Server] Failed to initialize backend server:', err);
  process.exit(1);
});
