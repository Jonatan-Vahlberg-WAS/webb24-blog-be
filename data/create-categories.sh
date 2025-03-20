#!/bin/bash

# API base URL - change this to match your API URL
API_URL="http://localhost:3000/api"

# Function to create a category
create_category() {
    local category_name="$1"
    echo "Creating category: $category_name"
    
    curl -X POST \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$category_name\"}" \
        "$API_URL/categories"
    
    echo -e "\n"
}

# Array of categories to create
categories=(
    "Technology"
    "Programming"
    "Web Development"
    "Software Engineering"
    "Data Science"
    "Artificial Intelligence"
    "DevOps"
    "Career"
    "Tutorial"
    "Best Practices"
)

# Create each category
for category in "${categories[@]}"; do
    create_category "$category"
done

# List all categories
echo "Listing all categories:"
curl "$API_URL/categories"