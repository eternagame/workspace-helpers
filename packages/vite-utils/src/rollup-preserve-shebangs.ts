/**
 * Original implementation: https://github.com/elado/rollup-plugin-preserve-shebangs
 * This module has been vendorized due to its simplicity and lack of recent updates
 * to reduce our dependency/security surface.
 *
 * MIT License
 * Copyright (c) 2019 Elad Ossadon
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import type { Plugin } from 'vite';
import MagicString from 'magic-string';

const SHEBANG_RX = /^#!.*/;

export default function preserveShebangs() {
  const shebangs: Record<string, string> = {};

  const plugin: Plugin = {
    name: 'rollup-plugin-preserve-shebangs',
    transform(code, id) {
      const match = code.match(SHEBANG_RX);

      if (match?.[0]) {
        [shebangs[id]] = match;
      }

      return {
        code: code.replace(SHEBANG_RX, ''),
        map: null,
      };
    },
    renderChunk(code, chunk, { sourcemap }) {
      if (chunk.facadeModuleId && shebangs[chunk.facadeModuleId]) {
        const str = new MagicString(code);
        str.prepend(`${shebangs[chunk.facadeModuleId] ?? ''}\n`);
        return {
          code: str.toString(),
          map: sourcemap ? str.generateMap({ hires: true }) : null,
        };
      }
      return {
        code,
        map: null,
      };
    },
  };

  return plugin;
}
