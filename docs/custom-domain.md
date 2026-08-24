# Custom domain (cryp2bus.com)

## Why HTTPS is unavailable

GitHub cannot issue a certificate while **extra A records** remain next to GitHub Pages IPs.

Current problem seen in DNS:
- Good GitHub A: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
- Bad parking A (delete these): `15.197.148.33`, `3.33.130.190`
- `www` must be CNAME → `katrinvlasova0-coder.github.io.` (not to `cryp2bus.com`)

## Final DNS at GoDaddy (domaincontrol)

| Type  | Name | Value | Action |
|-------|------|-------|--------|
| A     | `@`  | `185.199.108.153` | keep |
| A     | `@`  | `185.199.109.153` | keep |
| A     | `@`  | `185.199.110.153` | keep |
| A     | `@`  | `185.199.111.153` | keep |
| A     | `@`  | `15.197.148.33` | **DELETE** |
| A     | `@`  | `3.33.130.190` | **DELETE** |
| AAAA  | `@`  | `2606:50c0:8000::153` | add if missing |
| AAAA  | `@`  | `2606:50c0:8001::153` | add if missing |
| AAAA  | `@`  | `2606:50c0:8002::153` | add if missing |
| AAAA  | `@`  | `2606:50c0:8003::153` | add if missing |
| CNAME | `www`| `katrinvlasova0-coder.github.io.` | replace current www target |

Also turn off GoDaddy **Domain Forwarding / Parking** for this domain if enabled.

After DNS is clean (only GitHub IPs), wait 5–60 minutes, then in GitHub → Settings → Pages → **Enforce HTTPS**.
