function getYoutubeQuery(topic) {

    const lower = topic.toLowerCase()

    // ================= DSA =================

    if (
        lower.includes("dsa") ||
        lower.includes("data structure") ||
        lower.includes("algorithm")
    )
        return {
            query: "Data Structures and Algorithms Interview Preparation",
            domain: "dsa"
        }

    if (lower.includes("graph"))
        return {
            query: "Graph Algorithms Interview Preparation",
            domain: "dsa"
        }

    if (lower.includes("dynamic programming"))
        return {
            query: "Dynamic Programming Interview Preparation",
            domain: "dsa"
        }

    // ================= System Design =================

    if (lower.includes("system design"))
        return {
            query: "System Design Interview Preparation",
            domain: "system-design"
        }

    if (lower.includes("microservice"))
        return {
            query: "Microservices Architecture",
            domain: "system-design"
        }

    if (lower.includes("load balancing"))
        return {
            query: "Load Balancer Explained",
            domain: "system-design"
        }

    if (lower.includes("database sharding"))
        return {
            query: "Database Sharding System Design",
            domain: "system-design"
        }

    if (lower.includes("caching"))
        return {
            query: "Caching System Design",
            domain: "system-design"
        }

    // ================= Frontend =================

    if (lower.includes("react"))
        return {
            query: "React Tutorial for Beginners",
            domain: "frontend"
        }

    if (lower.includes("next"))
        return {
            query: "Next.js Full Course",
            domain: "frontend"
        }

    if (lower.includes("javascript"))
        return {
            query: "JavaScript Interview Preparation",
            domain: "frontend"
        }

    if (lower.includes("typescript"))
        return {
            query: "TypeScript Full Course",
            domain: "frontend"
        }

    if (lower.includes("redux"))
        return {
            query: "Redux Toolkit Tutorial",
            domain: "frontend"
        }

    // ================= Backend =================

    if (lower.includes("node"))
        return {
            query: "Node.js Backend Tutorial",
            domain: "backend"
        }

    if (lower.includes("express"))
        return {
            query: "Express.js Tutorial",
            domain: "backend"
        }

    if (lower.includes("rest api"))
        return {
            query: "REST API Design Tutorial",
            domain: "backend"
        }

    if (lower.includes("graphql"))
        return {
            query: "GraphQL Tutorial",
            domain: "backend"
        }

    // ================= Database =================

    if (lower.includes("mongodb"))
        return {
            query: "MongoDB Tutorial",
            domain: "database"
        }

    if (lower.includes("sql"))
        return {
            query: "SQL Interview Preparation",
            domain: "database"
        }

    if (lower.includes("dbms"))
        return {
            query: "DBMS Placement Preparation",
            domain: "core"
        }

    if (lower.includes("postgres"))
        return {
            query: "PostgreSQL Tutorial",
            domain: "database"
        }

    // ================= DevOps =================

    if (lower.includes("docker"))
        return {
            query: "Docker Tutorial for Beginners",
            domain: "devops"
        }

    if (lower.includes("kubernetes"))
        return {
            query: "Kubernetes Tutorial",
            domain: "devops"
        }

    if (lower.includes("ci/cd"))
        return {
            query: "CI CD Pipeline Tutorial",
            domain: "devops"
        }

    if (lower.includes("jenkins"))
        return {
            query: "Jenkins Tutorial",
            domain: "devops"
        }

    if (lower.includes("terraform"))
        return {
            query: "Terraform Tutorial",
            domain: "devops"
        }

    if (lower.includes("prometheus"))
        return {
            query: "Prometheus Monitoring Tutorial",
            domain: "devops"
        }

    // ================= Cloud =================

    if (lower.includes("aws"))
        return {
            query: "AWS Tutorial for Beginners",
            domain: "cloud"
        }

    if (lower.includes("ec2"))
        return {
            query: "AWS EC2 Tutorial",
            domain: "cloud"
        }

    if (lower.includes("s3"))
        return {
            query: "AWS S3 Tutorial",
            domain: "cloud"
        }

    if (lower.includes("iam"))
        return {
            query: "AWS IAM Tutorial",
            domain: "cloud"
        }

    // ================= AI / ML =================

    if (
        lower.includes("machine learning") ||
        lower.includes("ml")
    )
        return {
            query: "Machine Learning Full Course",
            domain: "ml"
        }

    if (lower.includes("deep learning"))
        return {
            query: "Deep Learning Tutorial",
            domain: "ml"
        }

    if (lower.includes("cnn"))
        return {
            query: "Convolutional Neural Networks",
            domain: "ml"
        }

    if (lower.includes("transformer"))
        return {
            query: "Transformers Explained",
            domain: "ml"
        }

    if (
        lower.includes("llm") ||
        lower.includes("large language model")
    )
        return {
            query: "Large Language Models Tutorial",
            domain: "genai"
        }

    if (lower.includes("langchain"))
        return {
            query: "LangChain Tutorial",
            domain: "genai"
        }

    if (lower.includes("rag"))
        return {
            query: "RAG Explained",
            domain: "genai"
        }

    if (
        lower.includes("gen ai") ||
        lower.includes("generative ai")
    )
        return {
            query: "Generative AI Tutorial",
            domain: "genai"
        }

    if (lower.includes("prompt engineering"))
        return {
            query: "Prompt Engineering Tutorial",
            domain: "genai"
        }

    if (lower.includes("vector database"))
        return {
            query: "Vector Database Tutorial",
            domain: "genai"
        }

    // ================= Data Science =================

    if (lower.includes("numpy"))
        return {
            query: "NumPy Tutorial",
            domain: "data-science"
        }

    if (lower.includes("pandas"))
        return {
            query: "Pandas Tutorial",
            domain: "data-science"
        }

    if (lower.includes("matplotlib"))
        return {
            query: "Matplotlib Tutorial",
            domain: "data-science"
        }

    if (lower.includes("scikit"))
        return {
            query: "Scikit Learn Tutorial",
            domain: "data-science"
        }

    // ================= Distributed Systems =================

    if (lower.includes("kafka"))
        return {
            query: "Apache Kafka Tutorial",
            domain: "distributed-systems"
        }

    if (lower.includes("redis"))
        return {
            query: "Redis Tutorial",
            domain: "distributed-systems"
        }

    if (lower.includes("rabbitmq"))
        return {
            query: "RabbitMQ Tutorial",
            domain: "distributed-systems"
        }

    // ================= Core Subjects =================

    if (lower.includes("os"))
        return {
            query: "Operating System Placement Preparation",
            domain: "core"
        }

    if (lower.includes("cn"))
        return {
            query: "Computer Networks Placement Preparation",
            domain: "core"
        }

    if (lower.includes("oops"))
        return {
            query: "OOPs Interview Preparation",
            domain: "core"
        }

    // ================= Testing =================

    if (lower.includes("unit testing"))
        return {
            query: "Unit Testing Tutorial",
            domain: "testing"
        }

    if (lower.includes("jest"))
        return {
            query: "Jest Tutorial",
            domain: "testing"
        }

    // ================= Git =================

    if (lower.includes("git"))
        return {
            query: "Git Tutorial",
            domain: "tools"
        }

    if (lower.includes("github actions"))
        return {
            query: "GitHub Actions CI CD Tutorial",
            domain: "devops"
        }

    return {
        query: `${topic} tutorial`,
        domain: "general"
    }
}

module.exports = {
    getYoutubeQuery
}