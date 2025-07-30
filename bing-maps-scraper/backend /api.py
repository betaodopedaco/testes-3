from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from bing_scraper import scrape_bing_maps
import pandas as pd
import io
import os

app = Flask(__name__)
CORS(app)  # Permite chamadas do frontend

@app.route("/api/search", methods=["POST"])
def search():
    try:
        data = request.json
        results = scrape_bing_maps(
            search_term=data.get("query", ""),
            location=data.get("location", ""),
            num_items=min(int(data.get("limit", 10)), 20)  # Limite máximo de 20
        )
        
        # Converter para Excel se solicitado
        if request.args.get('format') == 'excel':
            df = pd.DataFrame(results)
            output = io.BytesIO()
            df.to_excel(output, index=False)
            output.seek(0)
            return send_file(
                output,
                mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                as_attachment=True,
                download_name="resultados.xlsx"
            )
        
        return jsonify(results)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
