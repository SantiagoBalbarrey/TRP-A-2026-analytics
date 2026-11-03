"""Paso 1. Lee los archivos .lgm (LongoMatch, JSON) y devuelve los partidos con sus eventos."""
import glob, json, os, re
import config


def _idmap(o, mp):
    if isinstance(o, dict):
        if "$id" in o:
            mp[o["$id"]] = o
        for v in o.values():
            _idmap(v, mp)
    elif isinstance(o, list):
        for v in o:
            _idmap(v, mp)


def load():
    out = []
    files = glob.glob(os.path.join(config.LGM_DIR, "*.lgm"))
    key = lambda x: (int(re.search(r"-F(\d+)-", x).group(1)), os.path.basename(x)[9:])
    for f in sorted(files, key=key):
        d = json.load(open(f, encoding="utf-8-sig"))
        mp = {}
        _idmap(d, mp)
        desc = d["Description"]
        fn = int(re.search(r"-F(\d+)-", f).group(1))
        code = f.split("-F%d-" % fn)[1][:-4]
        local = config.NAME_FIXES.get(desc["LocalName"], desc["LocalName"])
        visit = config.NAME_FIXES.get(desc["VisitorName"], desc["VisitorName"])
        pl, pv = config.SCORE_OVERRIDES.get(("F%d" % fn, code), (desc["LocalGoals"], desc["VisitorGoals"]))
        evs = []
        for e in d["Timeline"]:
            if "TimelineEvent" not in e.get("$type", ""):
                continue
            et = e["EventType"]
            et = mp[et["$ref"]] if "$ref" in et else et
            tags = []
            for t in e.get("Tags", []):
                t = mp.get(t["$ref"], t) if "$ref" in t else t
                tags.append((t.get("Group", "").strip().upper(), t.get("Value", "").strip().upper()))
            evs.append(dict(name=str(e.get("Name", "")), tipo=et["Name"], start=e["Start"], stop=e["Stop"], tags=tags))
        evs.sort(key=lambda x: x["start"])
        out.append(dict(file=os.path.basename(f), fn=fn, code=code, l=local, v=visit, pl=pl, pv=pv,
                        cal=desc["MatchDate"][:10], dash=d["Dashboard"]["Name"],
                        dur=d["FileSet"]["MediaFiles"][0]["Duration"] / 1000, evs=evs))
    return out


if __name__ == "__main__":
    M = load()
    print(len(M), "partidos,", sum(len(m["evs"]) for m in M), "eventos")
