import os
import re
import pandas as pd
from docx import Document

# 1. Define the parent folder where your participant subfolders are located
parent_folder = r"C:\Users\mmmue\OneDrive\Master Winfo\Master Thesis\4. Evaluation\User Tests"
output_csv = 'processed_observation_notes.csv'

# 2. Split your categories into Main Phases and Sub-Phases
main_phases = [
    "onboarding", 
    "warmup", 
    "conversation 1", 
    "chat 1", 
    "conversation 2", 
    "chat 2"
]

sub_phases = [
    "think aloud",
    "feedback",
    "partner",
    "summary",
    "questionnaire"
]

data = []

# 3. Loop through everything in the parent folder
for item in os.listdir(parent_folder):
    item_path = os.path.join(parent_folder, item)
    
    # 4. Check if the item is a FOLDER
    if os.path.isdir(item_path):
        
        for filename in os.listdir(item_path):
            if filename.endswith(".docx") and not filename.startswith("~"):
                
                doc_path = os.path.join(item_path, filename)
                doc = Document(doc_path)
                
                # --- NEW LOGIC: Extract participant ID ---
                # This finds the digits in "P01.docx" and converts them to the integer 1
                match = re.search(r'\d+', filename)
                participant_id = int(match.group()) if match else filename
                
                current_main_phase = "Pre-Phase / General" 
                current_sub_phase = "" 
                
                # The Trigger Switch
                start_collecting = False 
                
                for para in doc.paragraphs:
                    text = para.text.strip()
                    if not text:
                        continue
                    
                    if not start_collecting:
                        if "thank you for your participation" in text.lower():
                            start_collecting = True 
                        continue 
                    
                    clean_text = re.sub(r'^[-o○§·]\s*', '', text).strip()
                    
                    if clean_text.lower().startswith("observation"):
                        continue
                        
                    lower_text = clean_text.lower()
                    is_header = False
                    
                    # Check if the line is a MAIN phase
                    for mp in main_phases:
                        if lower_text.startswith(mp):
                            current_main_phase = clean_text.split('(')[0].replace(':', '').strip()
                            current_sub_phase = "" 
                            is_header = True
                            break
                    
                    # Check if it's a SUB phase
                    if not is_header:
                        for sp in sub_phases:
                            if lower_text.startswith(sp):
                                current_sub_phase = clean_text.replace(':', '').strip()
                                is_header = True
                                break
                    
                    # --- NEW LOGIC: Updated Data Structure ---
                    # Record the note using your exact transcript format
                    if not is_header and clean_text:
                        data.append({
                            "participant_id": participant_id,
                            "start": 0,
                            "end": 0,
                            "text": clean_text,
                            "speaker": "Speaker 1",
                            "source_type": "Observation Note",
                            "main_phase": current_main_phase,
                            "sub_phase": current_sub_phase
                        })

# 5. Convert to structured table and save
df = pd.DataFrame(data)
df.to_csv(output_csv, index=False, encoding='utf-8-sig')

print(f"Success! Extracted {len(data)} notes formatted for your transcript database.")