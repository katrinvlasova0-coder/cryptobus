# Custom domain (cryp2bus.com)

When DNS is ready:

1. Create `public/CNAME` with content: `cryp2bus.com`
2. Set GitHub Pages custom domain to `cryp2bus.com` (Settings → Pages)
3. Set repo variable `VITE_BASE` to `/`
4. Redeploy (push or workflow_dispatch)

DNS records (GitHub Pages):

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| AAAA | @ | 2606:50c0:8000::153 |
| AAAA | @ | 2606:50c0:8001::153 |
| AAAA | @ | 2606:50c0:8002::153 |
| AAAA | @ | 2606:50c0:8003::153 |
| CNAME | www | katrinvlasova0-coder.github.io. |
