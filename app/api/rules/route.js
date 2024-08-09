import { NextResponse } from 'next/server';
import { getRules, addRule, deleteRule } from '../../lib/rules';

export async function GET(req, { params }) {
    
    const data = await getRules();
    return NextResponse.json({ data });
}

export async function POST(req) {
    try {
        const { value, tag } = await req.json();
        if (!value || !tag) {
            return NextResponse.json({ error: "Missing 'value' or 'tag' in the request body" }, { status: 400 });
        }
        const data = await addRule(value, tag);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { ids } = await req.json();
        if (!ids || ids.length === 0) {
            return new NextResponse(JSON.stringify({ error: "Missing 'ids' in the request body" }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        const data = await deleteRule(ids);
        return new NextResponse(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}