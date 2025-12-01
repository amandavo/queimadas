from flask import Flask, jsonify, render_template
import pandas as pd
import os
from datetime import datetime

app = Flask(__name__)

latest_10min = os.path.join("static", "docs","focos_10min_20251126_2220.csv")

def load_latest_10min():
    db = pd.read_csv(latest_10min)

    features = []
    for _, row in db.iterrows():
        dt = pd.to_datetime(row["data"])
        formatted_date = dt.strftime("%d/%m/%Y %H:%M")
        features.append({
            "type": "Feature",
            "properties": {
                "satelite": row["satelite"],
                "data": formatted_date,
                "lat": row["lat"],
                "lon": row["lon"],
            },
            "geometry": {
                "type": "Point",
                "coordinates": [row["lon"], row["lat"]]
            }
        })
    return {"type": "FeatureCollection", "features": features}

daily = os.path.join("static", "docs", "focos_diario_br_20251126.csv")

def load_daily():
    db_day = pd.read_csv(daily)
    db_day = db_day.replace({pd.NA: None, float('nan'): None, "NaN": None, "nan": None})
    db_day = db_day.where(pd.notnull(db_day), None)

    daily_data = {
        "table": [],
        "pie": {},
        "bar": {}
    }

    for _, row in db_day.iterrows():
        daily_data["table"].append({
            "id": row["id"],
            "lat": row["lat"],
            "lon": row["lon"],
            "data_hora_gmt": row["data_hora_gmt"],
            "satelite": row["satelite"],
            "municipio": row["municipio"],
            "estado": row["estado"],
            "pais": row["pais"],
            "municipio_id": row["municipio_id"],
            "estado_id": row["estado_id"],
            "pais_id": row["pais_id"],
            "numero_dias_sem_chuva": row["numero_dias_sem_chuva"],
            "precipitacao": row["precipitacao"],
            "risco_fogo": row["risco_fogo"],
            "bioma": row["bioma"],
            "frp": row["frp"]
        })

        bioma = row["bioma"]
        daily_data["pie"][bioma] = daily_data["pie"].get(bioma, 0) + 1

        estado = row["estado"]
        daily_data["bar"][estado] = daily_data["bar"].get(estado, 0) + 1

    return daily_data

monthly = os.path.join("static", "docs", "focos_mensal_br_202511 - Copia.csv")

def load_monthly():
    db_month = pd.read_csv(monthly)
    db_month = db_month.replace({pd.NA: None, float('nan'): None, "NaN": None, "nan": None})
    db_month = db_month.where(pd.notnull(db_month), None)

    monthly_data = {
        "table": [],
        "pie": {},
        "bar": {}
    }

    for _, row in db_month.iterrows():
        monthly_data["table"].append({
            "id": row["id"],
            "lat": row["lat"],
            "lon": row["lon"],
            "data_hora_gmt": row["data_hora_gmt"],
            "satelite": row["satelite"],
            "municipio": row["municipio"],
            "estado": row["estado"],
            "pais": row["pais"],
            "municipio_id": row["municipio_id"],
            "estado_id": row["estado_id"],
            "pais_id": row["pais_id"],
            "numero_dias_sem_chuva": row["numero_dias_sem_chuva"],
            "precipitacao": row["precipitacao"],
            "risco_fogo": row["risco_fogo"],
            "bioma": row["bioma"],
            "frp": row["frp"]
        })

        bioma = row["bioma"]
        monthly_data["pie"][bioma] = monthly_data["pie"].get(bioma, 0) + 1

        estado = row["estado"]
        monthly_data["bar"][estado] = monthly_data["bar"].get(estado, 0) + 1

    return monthly_data

annual = os.path.join("static", "docs", "focos_anual_ref_br_2024 - Copia.csv")

def load_annual():
    db_annual = pd.read_csv(annual)

    annual_data = {
        "table": [],
        "pie": {},
        "bar": {}
    }

    for _, row in db_annual.iterrows():
        annual_data["table"].append({
            "id_bdq": row["id_bdq"],
            "foco_id": row["foco_id"],
            "lat": row["lat"],
            "lon": row["lon"],
            "data_pas": row["data_pas"],
            "pais": row["pais"],
            "estado": row["estado"],
            "municipio": row["municipio"],
            "bioma": row["bioma"]
        })

        bioma = row["bioma"]
        annual_data["pie"][bioma] = annual_data["pie"].get(bioma, 0) + 1

        estado = row["estado"]
        annual_data["bar"][estado] = annual_data["bar"].get(estado, 0) + 1

    return annual_data

hist_br = os.path.join("static", "docs", "historico_pais_brasil.csv")

def load_hist_br():
    db_hist_br = pd.read_csv(hist_br)
    db_hist_br = db_hist_br.replace({pd.NA: None, float('nan'): None, "NaN": None, "nan": None})
    db_hist_br = db_hist_br.where(pd.notnull(db_hist_br), None)

    return {"table": [
        {
            "ano": row[0],
            "janeiro": row["Janeiro"],
            "fevereiro": row["Fevereiro"],
            "marco": row["Março"],
            "abril": row["Abril"],
            "maio": row["Maio"],
            "junho": row["Junho"],
            "julho": row["Julho"],
            "agosto": row["Agosto"],
            "setembro": row["Setembro"],
            "outubro": row["Outubro"],
            "novembro": row["Novembro"],
            "dezembro": row["Dezembro"],
            "total": row["Total"]
        }
        for _, row in db_hist_br.iterrows()
    ]}

hist_sp = os.path.join("static", "docs", "historico_estado_sao_paulo.csv")

def load_hist_sp():
    db_hist_sp = pd.read_csv(hist_sp)
    db_hist_sp = db_hist_sp.replace({pd.NA: None, float('nan'): None, "NaN": None, "nan": None})
    db_hist_sp = db_hist_sp.where(pd.notnull(db_hist_sp), None)

    return {"table": [
        {
            "ano": row[0],
            "janeiro": row["Janeiro"],
            "fevereiro": row["Fevereiro"],
            "marco": row["Março"],
            "abril": row["Abril"],
            "maio": row["Maio"],
            "junho": row["Junho"],
            "julho": row["Julho"],
            "agosto": row["Agosto"],
            "setembro": row["Setembro"],
            "outubro": row["Outubro"],
            "novembro": row["Novembro"],
            "dezembro": row["Dezembro"],
            "total": row["Total"]
        }
        for _, row in db_hist_sp.iterrows()
    ]}


@app.route("/")
def index():
    return render_template("index.html")

@app.route("/api/focos10min")
def focos_10min():
    data = load_latest_10min()
    return jsonify(data)

@app.route('/api/daily', methods=['GET'])
def get_daily():
    try:
        data = load_daily()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/monthly', methods=['GET'])
def get_monthly():
    try:
        data = load_monthly()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/annual', methods=['GET'])
def get_annual():
    try:
        data = load_annual()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/hist-br', methods=['GET'])
def get_hist_br():
    try:
        data = load_hist_br()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/hist-sp', methods=['GET'])
def get_hist_sp():
    try:
        data = load_hist_sp()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
