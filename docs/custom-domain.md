# Custom domain (cryp2bus.com)

## DNS records to set at the registrar

Remove parking / temporary A records for `@` and `www`, then add:

| Type  | Name | Value                         | TTL  |
|-------|------|-------------------------------|------|
| A     | `@`  | `185.199.108.153`             | 600  |
| A     | `@`  | `185.199.109.153`             | 600  |
| A     | `@`  | `185.199.110.153`             | 600  |
| A     | `@`  | `185.199.111.153`             | 600  |
| AAAA  | `@`  | `2606:50c0:8000::153`         | 600  |
| AAAA  | `@`  | `2606:50c0:8001::153`         | 600  |
| AAAA  | `@`  | `2606:50c0:8002::153`         | 600  |
| AAAA  | `@`  | `2606:50c0:8003::153`         | 600  |
| CNAME | `www`| `katrinvlasova0-coder.github.io.` | 600 |

Do **not** keep old parking A/AAAA for `@` (currently pointing away from GitHub).

## After DNS propagates

1. Restore `public/CNAME` with one line: `cryp2bus.com`
2. GitHub → Settings → Pages → Custom domain: `cryp2bus.com` → Enforce HTTPS
3. Repo variable `VITE_BASE` → `/`
4. Redeploy (push or Actions → workflow_dispatch)

Until then the live site is: https://katrinvlasova0-coder.github.io/cryptobus/
